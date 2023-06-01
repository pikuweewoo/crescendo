import React, { useEffect, useRef, useState } from 'react'
import AudioContext from '../contexts/AudioContext';
import autoCorrelate from '../components/AutoCorrelate';
import {
    noteFromPitch,
    centsOffFromPitch,
    getDetunePercent,
} from "../components/Helpers";
import MeterPointer from '../components/MeterPointer';
import MeterScales from '../components/MeterScales';
import Notes from '../components/Notes';
import * as speechCommands from "@tensorflow-models/speech-commands"

const audioCtx = AudioContext.getAudioContext();
const analyserNode = AudioContext.getAnalyser();
const buflen = 2048;
var buf = new Float32Array(buflen);
const noteStrings = [
    "C",
    "C♯",
    "D",
    "D♯",
    "E",
    "F",
    "F♯",
    "G",
    "G♯",
    "A",
    "A♯",
    "B",
];
const middleA = 440;
const URL = "https://teachablemachine.withgoogle.com/models/RA0Vj1Rxo/";

export default function Tuner() {
    const semitone = 69;
    const bufferSize = 4096;
    const refNotesList = useRef(null);
    const refVisualizer = useRef(null);
    const [notes, setNotes] = useState([]);
    const [activeNote, setActiveNote] = useState('');
    const [frequency, setFrequency] = useState('');
    //test
    const [source, setSource] = useState(null);
    const [started, setStart] = useState(false);
    const [pitchNote, setPitchNote] = useState("C");
    const [pitchScale, setPitchScale] = useState("4");
    const [pitch, setPitch] = useState("Presiona Iniciar para empezar a afinar tu instrumento");
    const [detune, setDetune] = useState("0");
    const [notification, setNotification] = useState(false);
    const [model, setModel] = useState(null);
    const [labels, setLabels] = useState(null);
    const [action, setAction] = useState(null);


    useEffect(() => { // Initialize note list
        getNotes()
        //loadModel() // modelo IA Teachable machine para stacatto/legato
    }, []);

    useEffect(() => {
        if (source != null) {
            source.connect(analyserNode);
            setInterval(updatePitch, 1000);
        }
    }, [source]);

    const updatePitch = (time) => {
        analyserNode.getFloatTimeDomainData(buf);
        var ac = autoCorrelate(buf, audioCtx.sampleRate);
        if (ac > -1) {
            let note = noteFromPitch(ac);
            let sym = noteStrings[note % 12];
            let scl = Math.floor(note / 12) - 1;
            let dtune = centsOffFromPitch(ac, note);
            setPitch(parseFloat(ac).toFixed(2) + " Hz");
            setPitchNote(sym);
            setPitchScale(scl);
            setDetune(dtune);
            setNotification(false);
            activateNote(note)
            updatePointer(dtune);
            console.log(note, sym, scl, dtune, ac);
        } else {
            if (started) {
                setPitch("Audio no detectado, acerca tu instrumento al dispositivo")
            } else {
                setPitch("Presiona Iniciar para empezar a afinar tu instrumento")
            }
        }
    };

    // run updatePitch as long as tuner is started

    const start = async () => {
        const input = await getMicInput();
        if (audioCtx.state === "suspended") {
            await audioCtx.resume();
        }
        setStart(true);
        setNotification(true);
        setTimeout(() => setNotification(false), 5000);
        setSource(audioCtx.createMediaStreamSource(input));
    };

    const stop = () => {
        source.disconnect(analyserNode);
        setStart(false);
    };

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

    const getNotes = () => {
        var notesList = document.querySelector('#notes-list');
        setNotes([...notesList.querySelectorAll('.note')]);
    }

    const loadModel = async () => {
        const checkpointURL = URL + "model.json"; // model topology
        const metadataURL = URL + "metadata.json"; // model metadata
        const recognizer = await speechCommands.create(
            "BROWSER_FFT", // fourier transform type, not useful to change
            undefined, // speech commands vocabulary feature, not useful for your models
            checkpointURL,
            metadataURL);
        await recognizer.ensureModelLoaded();
        console.log('Model Loaded')
        setModel(recognizer);
        setLabels(recognizer.wordLabels());
    }

    function argMax(arr) {
        return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
    }

    const recognizeCommands = async () => {
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
        console.log('Stopped listening.')
    }

    const updatePointer = (deg) => { // moves the pointer according to frequency accuracy
        const element = document.getElementById('pointer');
        element.style.transform = "rotate(" + deg + "deg)";
    }

    function activateNote(value) { // activates note via microphone
        notes.forEach(note => {
            if (note.getAttribute('data-value') == value) {
                // Set active note and slide current active note to middle of note list
                note.setAttribute('class', 'note active')
                var scrollValue = note.offsetLeft - (refNotesList.current.clientWidth - note.clientWidth) / 2;
                refNotesList.current.scrollLeft = scrollValue;
            } else {
                // If active note isn't equal, remove active status
                note.setAttribute('class', 'note')
            }
        })
    }

    const changeActiveNote = (e) => { // activates note via clicking, to play a pedal note TODO
        let { className } = e.target;
        let value = e.target.getAttribute('data-value');
        if (className === 'note') {
            notes.forEach(note => {
                console.log(note.className)
                if (note.getAttribute('data-value') == value) {
                    // Set current heard note as active
                    note.setAttribute('class', 'note active')

                    // Move active note to the middle
                    var scrollValue = note.offsetLeft - (refNotesList.current.clientWidth - note.clientWidth) / 2;
                    refNotesList.current.scrollLeft = scrollValue;
                } else {
                    // If active note isn't equal, remove active status
                    note.setAttribute('class', 'note')
                }
            })
        }
    }

    return (
        <div className='py-2'>
            <div  >
                {/*<div className="a4">A<sub>4</sub> = <span>440</span> Hz</div>*/}
                <br />
                <div className="meter" >
                    <div className="meter-dot" ></div>
                    <MeterPointer deg={0} />
                    <MeterScales />
                </div>

                <div className="notes">
                    <div className="notes-list" id="notes-list" ref={refNotesList} style={{ userSelect: 'none' }}>
                        <Notes
                            noteStrings={noteStrings}
                            changeActiveNote={changeActiveNote} />
                    </div>
                    <div className="frequency">
                        <span>{pitch}</span>
                    </div>
                    {!started ?
                        (
                            <div className='justify-center flex'>
                                <button
                                    onClick={start}
                                    className="flex justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                                >
                                    Iniciar
                                </button>
                            </div>
                        ) : (
                            <div className='justify-center flex'>
                                <button
                                    onClick={stop}
                                    className="flex justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                                >
                                    Detener
                                </button>
                            </div>
                        )}
                    {/*<div className='px-5 py-2'>
                        <button
                            onClick={recognizeCommands}
                            className="justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"

                        >Record</button>
                    </div>
                    <div className='px-5 py-2'>
                        <button
                            onClick={stopAudioModel}
                            className="justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"

                        >Stop</button>
                    </div>
                        {action ? <div id="label-container" className='space-y-2 bg-white px-4 py-4 sm:p-6 rounded-md font-bold text-2xl'>{action}</div> : <div>No action detected</div>}*/}
                </div>
            </div>
        </div>
    )
}
