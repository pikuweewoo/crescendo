import { useEffect, useRef, useState } from "react";
import PageComponent from "../components/PageComponent";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios";
import { useStateContext } from "../contexts/ContextProvider";
import TButton from "../components/core/TButton";
import { PlayIcon } from "@heroicons/react/24/outline";
import AudioContext from '../contexts/AudioContext';
import autoCorrelate from '../components/AutoCorrelate';
import {
    noteFromPitch,
    centsOffFromPitch,
    getDetunePercent,
} from "../components/Helpers";
import * as speechCommands from "@tensorflow-models/speech-commands"
import click1audio from "../components/core/click1.wav";
import click2audio from "../components/core/click2.wav";
import moment from 'moment'

let numberOfStaves = 0;
let currentStaff = 0;
let currentNote = '';
let currentHeardNote = '';
let currentNoteWait = 0;
let currentNoteDuration = '';
let noteSequence = [];
let array = [];
let sheetData = [];
const noteDurations = [
    {
        'half': 120,
        'quarter': 60,
        'eighth': 30,
        'sixteenth': 15,
        'half.': 180,
        'quarter.': 90,
        'eighth.': 45,
        'triplet': 20
    }
]
let countOk = 0;
let countMiss = 0;
let mainNoteDurationNumber = 0;
let currentNoteDurationNumber = 0;
let readAgain = 0;
let entranceType = '';
let entranceCount = 0;
let keySignature = '';
const audioCtx = AudioContext.getAudioContext();
const analyserNode = AudioContext.getAnalyser();
const buflen = 2048;
var buf = new Float32Array(buflen);
const noteStrings = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
];
const noteStringsSp = [
    "Do",
    "Do#",
    "Re",
    "Re#",
    "Mi",
    "Fa",
    "Fa#",
    "Sol",
    "Sol#",
    "La",
    "La#",
    "Si",
];
const middleA = 440;
const URL = "https://teachablemachine.withgoogle.com/models/RA0Vj1Rxo/";
const click1 = new Audio(click1audio);
const click2 = new Audio(click2audio);
let currentNoteCountYes = 0;
let currentNoteCountNo = 0;
let currentNoteComparison = '';

export default function LessonPlayer() {
    const { currentUser } = useStateContext();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { showToast } = useStateContext();
    const [source, setSource] = useState(null);
    const [started, setStart] = useState(false);
    const [sheet, setSheet] = useState({
        title: "",
        slug: "",
        description: "",
        image: null,
        image_url: null,
        image_type: null,
        notemap: []
    });
    const [model, setModel] = useState(null);
    const [labels, setLabels] = useState(null);
    const [action, setAction] = useState(null);
    const [noteText, setNoteText] = useState(null);
    const [pitch, setPitch] = useState("");
    const [pitchNote, setPitchNote] = useState("");
    const [pitchScale, setPitchScale] = useState("");
    const [detune, setDetune] = useState("0");
    const [preCount, setPreCount] = useState(0);
    const [studentLesson, setStudentLesson] = useState({
        current_progress: "",
        last_accessed_at: "",
        lesson_id: "",
        score: "",
        start_date: "",
        status: "",
        user_id: ""
    });
    const [metronome, setMetronome] = useState({
        isPlaying: false,
        count: 0,
        tempo: 60,
        mainFigure: 'quarter', //negra
        beatsPerMeasure: 4
    })
    const [currentPitch, setCurrentPitch] = useState("");
    const [currentPitchEsp, setCurrentPitchEsp] = useState("");
    let timer = 0;
    let timer2 = 0;

    // Escucha la activacion o desactivacion del metronomo
    useEffect(() => {
        if (metronome.isPlaying == true) {
            timer = setInterval(playClick, (mainNoteDurationNumber / metronome.tempo) * 1000); // 60 = valor de negra
        }
    }, [metronome.isPlaying])

    // Carga inicial de datos
    useEffect(() => {
        //loadModel()
        setStart(false);
        countOk = 0;
        countMiss = 0;
        mainNoteDurationNumber = 0;
        currentNoteDurationNumber = 0;
        readAgain = 0;
        entranceType = '';
        entranceCount = 0;
        keySignature = '';
        numberOfStaves = 0;
        currentStaff = 0;
        currentNote = '';
        currentHeardNote = '';
        currentNoteWait = 0;
        currentNoteDuration = '';
        noteSequence = [];
        array = [];
        sheetData = [];
        clearInterval(timer);
        if (id) {
            setLoading(true)
            axiosClient.get(`/sheet/${id}`)
                .then(({ data }) => {
                    data.data.notemap = JSON.parse(data.data.notemap)
                    setSheet(data.data)
                    setLoading(false)
                })
            axiosClient.get(`/currentLesson/${id}`)
                .then(({ data }) => {
                    setStudentLesson(data)
                    setLoading(false)
                })
        }
    }, [])

    useEffect(() => {
        if (pitchScale == 'CORRECTO') {
            setNoteText('CORRECTO'); setPitchScale('');
        } else {
            if (pitchScale == 'INCORRECTO') setNoteText('INCORRECTO'); setPitchScale('');
        }
    }, [pitchScale])

    const preprocessSheetData = () => {
        sheetData = [];
        for (let index = 0; index < sheet.notemap.length; index++) {
            const element = sheet.notemap[index].data;
            if (index == 0) {
                sheetData.push(element);
            }
        }
        let array = sheetData[0].replaceAll(' ', '').replaceAll('"', '').split(',');
        // Armadura, Signatura de Clave, Tecnica, Tipo de Entrada
        keySignature = array.shift();
        sheetData = array.shift();
        array.shift();
        entranceType = array.shift();
        //console.log(sheetData, entranceType, keySignature)
        if (sheetData == 'timeSignature-2/4') { // dos pulsos de negra
            metronome.beatsPerMeasure = 2;
            metronome.tempo = 40;
            metronome.mainFigure = 'quarter'; // negra vale 1 pulso
        } else {
            if (sheetData == 'timeSignature-2/2') { // dos pulsos de blanca
                metronome.beatsPerMeasure = 2;
                metronome.tempo = 80;
                metronome.mainFigure = 'half'; // blanca vale 1 pulso
            } else {
                if (sheetData == 'timeSignature-C') { // 4/4 o cuatro pulsos de negra
                    metronome.beatsPerMeasure = 4;
                    metronome.tempo = 60;
                    metronome.mainFigure = 'quarter'; // negra vale 1 pulso
                } else {
                    if (sheetData == 'timeSignature-3/4') { // 3/4 o tres pulsos de negra
                        metronome.beatsPerMeasure = 3;
                        metronome.tempo = 80;
                        metronome.mainFigure = 'quarter'; // negra vale 1 pulso
                    }
                }
            }
        }
        mainNoteDurationNumber = noteDurations[0][metronome.mainFigure];
    }

    const preprocessNoteMap = () => {
        for (let index = 0; index < sheet.notemap.length; index++) {
            let element = sheet.notemap[index].data;
            if (index > 0) {
                array.push(element);
            }
        }
    }

    // Iniciar el metronomo
    const onStartPlayingClick = () => {
        array = [];
        // Calcula la cantidad de pentagramas del mapa de notas
        preprocessNoteMap()
        preprocessSheetData()
        // Extraer la secuencia de notas 
        // currentStaff
        noteSequence = array[currentStaff].replaceAll(' ', '').replaceAll(',barline', '')
        //console.log(noteSequence)
        if (keySignature == 'keySignature-AM') {
            noteSequence = noteSequence.replaceAll('F', 'F#').replaceAll('C', 'C#').replaceAll('G', 'G#')
        }
        if (keySignature == 'keySignature-DM') {
            noteSequence = noteSequence.replaceAll('F', 'F#').replaceAll('C', 'C#')
        }
        if (keySignature == 'keySignature-GM') {
            noteSequence = noteSequence.replaceAll('F', 'F#')
        }
        noteSequence = noteSequence.split(',');
        //console.log(noteSequence)
        numberOfStaves = array.length;
        metronome.isPlaying = true;
        playClick();
        start();
        //recognizeCommands();
    }

    // Detener el metronomo
    const onStopPlayingClick = () => {
        clearInterval(timer)
        metronome.count = 0;
        entranceCount = 0;
        metronome.isPlaying = false;
        setMetronome({ ...metronome, isPlaying: false })
    }

    // Funcion metronomo
    const playClick = () => {
        if (metronome.isPlaying) {
            const { count, beatsPerMeasure } = metronome;
            if (entranceType == 'Thetic') {
                if (entranceCount < metronome.beatsPerMeasure) {
                    entranceCount++;
                    setPreCount(entranceCount);
                } else {
                    noteMapRead()
                }
            } else {
                let lastNote = array[numberOfStaves - 1].replaceAll(' ', '').replaceAll(',barline', '').split(',').pop();
                currentNote = lastNote.replaceAll('note-', '');
                let noteSplit2 = currentNote.search('-')
                //console.log(lastNote, mainNoteDurationNumber)
                let lastNoteDuration = currentNote.slice(noteSplit2 + 1)
                let lastNoteDurationNumber = noteDurations[0][lastNoteDuration];
                let lastNoteWait = lastNoteDurationNumber / mainNoteDurationNumber;
                let sumEntranceValue = metronome.beatsPerMeasure - lastNoteWait;
                if (entranceCount <= lastNoteWait) {
                    entranceCount = entranceCount + sumEntranceValue;
                    setTimeout(() => {
                        click1.play()
                        entranceCount = entranceCount + sumEntranceValue;
                        console.log(entranceCount, lastNoteWait)
                        if (entranceCount >= lastNoteWait) noteMapRead()
                    }, (((mainNoteDurationNumber / 2) / metronome.tempo) * 1000))
                } else {
                    noteMapRead()
                }
            }

            // Genera los pulsos principales
            if (count % beatsPerMeasure === 0) {
                click2.play()
            } else {
                click1.play()
            }
            // Si la duracion de la nota es menor a la principal, volver a leer la nota.
            if (readAgain > 0) {
                setTimeout(() => { // leer de nuevo
                    if (currentNoteDuration != metronome.mainFigure) click1.play() // usar set interval para repetir las notas, TODO PROBAR
                    noteMapRead() // lee nota
                    let bandera = readAgain;
                    if (bandera > 1) { // si es una fraccion mas pequeña, leer mas veces
                        for (let index = 1; index < (bandera); index++) {
                            noteMapReadAgain()
                        }
                    }
                }, ((currentNoteDurationNumber / metronome.tempo) * 1000))
            }
            metronome.count = (count + 1) % beatsPerMeasure;
        }
    }

    // Funcion para leer notas mas pequeñas
    const noteMapReadAgain = () => {
        setTimeout(() => {
            noteMapRead()
            if (currentNoteDuration != metronome.mainFigure) click1.play()
        }, ((currentNoteDurationNumber / metronome.tempo) * 1000))
    }

    // Funcion de lectura de notas
    const noteMapRead = () => {
        if (noteSequence.length == 0) {
            // Cambia al siguiente pentagrama 
            currentStaff++;
            // Se compara el pentagrama actual con la cantidad total de pentagramas
            if (currentStaff < numberOfStaves) {
                noteSequence = array[currentStaff].replaceAll(' ', '').replaceAll(',barline', '');
                if (keySignature == 'keySignature-AM') {
                    noteSequence = noteSequence.replaceAll('F', 'F#').replaceAll('C', 'C#').replaceAll('G', 'G#')
                }
                if (keySignature == 'keySignature-DM') {
                    noteSequence = noteSequence.replaceAll('F', 'F#').replaceAll('C', 'C#')
                }
                if (keySignature == 'keySignature-GM') {
                    noteSequence = noteSequence.replaceAll('F', 'F#')
                }
                noteSequence = noteSequence.split(',');
                //console.log(noteSequence)
            } else {
                onStopPlayingClick();
                stop;
                //stopAudioModel();
                showToast('Leccion finalizada, procesando puntaje total...')
                let countTotal = countOk + countMiss;
                let score = 0;
                score = ((countOk / countTotal) * 100).toFixed(1);
                let stars = 0;
                //console.log('Your total score is of: ', score.toFixed(1), '%')
                if (score > 84) {
                    stars = 5;
                } else {
                    if (score > 69) {
                        stars = 4;
                    } else {
                        if (score > 54) {
                            stars = 3;
                        } else {
                            if (score > 39) {
                                stars = 2;
                            } else {
                                if (score > 24) {
                                    stars = 2;
                                } else {
                                    stars = 1;
                                }
                            }
                        }
                    }
                }
                let currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                studentLesson[0]['score'] = score;
                studentLesson[0]['current_progress'] = "Completado";
                if (!studentLesson[0]['start_date']) studentLesson[0]['start_date'] = currentDate
                studentLesson[0]['last_accessed_at'] = currentDate;
                //console.log('Total: ', countTotal)
                //console.log('Ok: ', countOk, '| Miss:', countMiss);
                onSubmit();
            }
        }
        // Se leen las notas mientras hayan notas en el pentagrama
        if (noteSequence.length > 0) {
            // If para tiempo de espera segun la duracion de la nota 
            if ((currentNoteWait <= 1)) {
                // Se extrae el primer elemento del array, que siempre representa la nota a ser tocada.
                currentNote = noteSequence.shift();
                // Se extrae el nombre de la nota en 'currentNote', y la duracion en 'currentNoteDuration'
                currentNote = currentNote.replaceAll('note-', '');
                let noteSplit2 = currentNote.search('-')
                currentNoteDuration = currentNote.slice(noteSplit2 + 1)
                currentNote = currentNote.slice(0, noteSplit2);
                setCurrentPitch(currentNote)
                //console.log('Note: ', currentNote)
                //console.log('Note Duration: ', currentNoteDuration)
                currentNoteDurationNumber = noteDurations[0][currentNoteDuration];
                //console.log(currentNoteDurationNumber, mainNoteDurationNumber)
                currentNoteWait = currentNoteDurationNumber / mainNoteDurationNumber;
                //console.log('Read again: ', readAgain)
                //console.log('Current wait: ', currentNoteWait)
                currentNoteComparison = ''
                // Si la duracion de la nota es menor a la principal, volver a leer la nota.
                if (currentNoteDurationNumber < mainNoteDurationNumber) {
                    readAgain = (mainNoteDurationNumber / currentNoteDurationNumber) / 2;
                } else {
                    readAgain = 0;
                }
                //console.log(readAgain)
            } else {
                // Disminuir tiempo de espera
                currentNoteWait--;
            }
        }
    }

    // Tuner
    useEffect(() => {
        if (source != null) {
            source.connect(analyserNode);
            clearInterval(timer2)
            timer2 = setInterval(updatePitch, 200); // aqui estaria la solucion 
        }
    }, [source]);

    // Actualiza la frecuencia escuchada
    const updatePitch = (time) => {
        analyserNode.getFloatTimeDomainData(buf); // Obtiene la representacion de 
        var ac = autoCorrelate(buf, audioCtx.sampleRate); 
        if (ac > -1) {
            let note = noteFromPitch(ac);
            let sym = noteStrings[note % 12];
            let scl = Math.floor(note / 12) - 1;
            //let dtune = centsOffFromPitch(ac, note);
            //console.log(note, sym, scl, dtune, ac);
            currentHeardNote = sym + scl;
            setPitchNote(currentHeardNote);
            //console.log(currentHeardNote)
            if (currentNote != currentNoteComparison) {
                if (currentNoteCountYes >= currentNoteCountNo) {
                    countOk++
                    setPitchScale('CORRECTO')
                } else {
                    countMiss++
                    setPitchScale('INCORRECTO')
                }
                //console.log(currentNote)
                //console.log('OK: ', countOk, countMiss)
                //console.log('Cantidad de analisis por nota: ', currentNoteCountYes + currentNoteCountNo)
                currentNoteCountYes = currentNoteCountNo = 0;
                currentNoteComparison = currentNote
            }
            //console.log('Nota escuchada:', currentHeardNote)
            if (currentHeardNote == currentNote) {
                currentNoteCountYes++
            } else {
                if (currentNote != '') currentNoteCountNo++
            }
            //console.log('Si: ', currentNoteCountYes, 'No: ', currentNoteCountNo)
        } else {
            if (started) {
                setPitch("No audio detected, bring your instrument closer to your device.")
            } else {
                setPitch("Press start to begin tuning your instrument.")
            }
        }
    };

    // Inicializa el afinador
    const start = async () => {
        const input = await getMicInput();
        if (audioCtx.state === "suspended") {
            await audioCtx.resume();
        }
        setStart(true);
        setSource(audioCtx.createMediaStreamSource(input));
    };

    // Detiene el afinador
    const stop = () => {
        source.disconnect(analyserNode);
        setStart(false);
        clearInterval(timer2)
    };

    // Recibe input del microfono
    const getMicInput = () => {
        return navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                autoGainControl: false,
                noiseSuppression: false,
                latency: 0
            },
        });
    };

    // ML model Stacatto Legato
    const loadModel = async () => {
        const checkpointURL = URL + "model.json"; // model topology
        const metadataURL = URL + "metadata.json"; // model metadata
        const recognizer = await speechCommands.create(
            "BROWSER_FFT", // fourier transform type, not useful to change
            undefined, // speech commands vocabulary feature, not useful for your models
            checkpointURL,
            metadataURL);
        await recognizer.ensureModelLoaded();
        setModel(recognizer);
        setLabels(recognizer.wordLabels());
    }

    function argMax(arr) {
        return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
    }

    const recognizeCommands = async () => {
        console.log('Model started listening.')
        model.listen(result => {
            const scores = result.scores;
            setAction(labels[argMax(Object.values(result.scores))])
        }, {
            includeSpectrogram: true, // in case listen should return result.spectrogram
            probabilityThreshold: 0.9,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
        });
        //setTimeout(() => model.stopListening(), 10e3)
    }

    const stopAudioModel = () => {
        model.stopListening();
    }

    // Submit de datos
    const onSubmit = () => {
        const payload = { studentLesson };
        let res = null;
        res = axiosClient.put(`/lesson/play/${id}`, payload);
        res.then((res) => {
            navigate('/lessons');
            location.reload();
            showToast("Tu progreso fue exitosamente actualizado.")
        })
            .catch((err) => {
                if (err.response) {
                    const finalErrors = Object.values(err.response.data.errors).reduce((accum, next) => [...next, ...accum], [])
                    setError({ __html: finalErrors.join('<br>') })
                }
                console.log(err, err.response);
            });
    }

    return (
        <PageComponent
            title={'Reproductor de leccion'}>
            {loading && <div className="text-center text-lg">Cargando...</div>}
            {!loading &&
                <div className="shadow sm:overflow-hidden sm:rounded-md justify-center">
                    {metronome.isPlaying ?
                        <div className='justify-center align-center items-center bg-purple-700 px-4 py-4 rounded-md font-bold text-2xl'>
                            {currentPitch ? (<div className="text-white align-center justify-center text-center text-2xl">
                                Nota actual: {currentPitch}
                            </div>) : (
                                <div className="text-white align-center justify-center text-center text-2xl">
                                    Preparate para tocar: <label className="text-purple-200 text-4xl">{preCount}</label>
                                </div>
                            )}
                            {noteText == 'CORRECTO' ?
                                <div className="text-emerald-500 justify-center text-center text-4xl">{noteText}</div>
                                :
                                <div className="text-red-500 justify-center text-center text-4xl">{noteText}</div>
                            }
                        </div>
                        :
                        <div>
                        </div>
                    }
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                        {/*<div>
                            <label htmlFor="video-title" className="block text-sm font-medium leading-6 text-gray-900">
                                <b>Title: </b> {sheet.title}
                            </label>
                        </div>
                        <div>
                            <label htmlFor="video-description" className="block text-sm font-medium leading-6 text-gray-900">
                                <b>Description: </b> {sheet.description}
                            </label>
                </div>*/}
                        {/*Sheet*/}
                        <div className="justify-center flex">
                            <div className="mt-1 items-center " style={{
                                minWidth: '200px',
                                maxWidth: '800px',
                                heigth: '500px',
                                border: '3px solid #fff',
                                borderRadius: '5px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                {sheet.image_url && (
                                    <>
                                        {sheet.image_type === 'application/pdf' ? (
                                            <iframe src={sheet.image_url} />
                                        ) : (
                                            <img
                                                src={sheet.image_url}
                                                alt=""
                                                className="object-cover"
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        {/*Sheet*/}
                        <div className="flex px-4 py-3 sm:px-6" style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {!metronome.isPlaying && <TButton onClick={onStartPlayingClick} color='indigo'>
                                <PlayIcon className="h-6 w-6 mr-2" />
                                Empezar a tocar
                            </TButton>}
                        </div>
                    </div>
                </div>
            }
        </PageComponent>
    )
}
