import React, { useEffect, useRef, useState } from 'react'
import PageComponent from '../components/PageComponent'
import { createWorker } from 'tesseract.js'
import axiosClient from '../axios';
import ArchiveDetail from '../components/ArchiveDetail';
import { useStateContext } from '../contexts/ContextProvider';

export default function OCRView() {
    const { currentUser } = useStateContext();
    const [imageData, setImageData] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [progress, setProgress] = useState(0);
    const [progressLabel, setProgressLabel] = useState('idle');
    const [ocrResult, setOcrResult] = useState('');
    const [videos, setVideos] = useState([]);
    const [status, setStatus] = useState(false);
    const [videoList, setVideoList] = useState([]);
    const [image, setImage] = useState({
        image: null,
        image_url: null,
    });
    const [loadingNoteMap, setLoadingNoteMap] = useState(false);
    const [loadingOCR, setLoadingOCR] = useState(false);
    const [noteMap, setNoteMap] = useState('');
    let array = [];
    let tags = '';
    let foundVideoList = [];

    const onImageChoose = (ev) => {
        const file = ev.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const imageDataUri = reader.result;
            setImageUrl(file);
            setImageData(imageDataUri);
            setImage({
                ...image,
                image: file,
                image_url: reader.result
            })
        }
        reader.readAsDataURL(file);

    }

    const workerRef = useRef(null);

    const initWorker = async () => {
        workerRef.current = await createWorker({
            logger: message => {
                if ('progress' in message) {
                    setProgress(message.progress);
                    setProgressLabel(message.progress == 1 ? 'Done' : message.status);
                }
            }
        });
        return () => {
            workerRef.current.terminate();
            workerRef.current = null;
        }
    }

    const getVideos = (url) => {
        url = url || '/videos'
        axiosClient.get(url).then(({ data }) => {
            setVideos(data.data);
        });
    }

    const getTags = () => {
        array = [];
        videos.forEach(video => {
            array = array.concat(JSON.parse(video.tags));
        });
    }

    const findVideoTags = (result) => {
        array = [];
        let foundTagArray = result.trimEnd().split(' ')
        foundVideoList = [];
        //console.log(foundTagArray)
        let videoData = '';
        let bandera = 0;
        videos.forEach(video => {
            bandera = 0;
            videoData = JSON.parse(video.tags);
            videoData.forEach(element => {
                //console.log(element, foundTagArray)
                foundTagArray.forEach(foundTag => {
                    //console.log(foundTag, element.data)
                    if (element.data === foundTag) {
                        bandera++;
                        //console.log(element.data)
                        //console.log(element.data, 'Video tag found')
                    }
                });
            });
            if (bandera > 0) {
                //console.log(video.id, 'Video:', video.title);
                foundVideoList.push(video);
            }
        });
        //console.log(foundVideoList)
        setVideoList(foundVideoList)
    }

    const getNoteMapOMR = () => {
        setLoadingNoteMap(true);
        const payload = { ...image }
        if (payload.image) {
            payload.image = payload.image_url;
        }
        delete payload.image_url;
        axiosClient.post('/omr', payload)
            .then(({ data }) => {
                setNoteMap(data);
                setLoadingNoteMap(false);
            });
    }

    useEffect(() => {
        getVideos()
        initWorker();
    }, []);

    const handleResult = async () => {
        setStatus(true);
        setProgress(0);
        setLoadingOCR(true);
        setProgressLabel('starting');
        //getNoteMapOMR();
        const worker = workerRef.current;
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const response = await worker.recognize(imageData);
        setLoadingOCR(false);
        setOcrResult(response.data.text);
        getTags();
        let result = response.data.text;
        //console.log(result)
        let matchResult = '';
        tags = '';
        array.forEach(element => {
            let tag = element.data;
            //console.log(tag)
            matchResult = result.search(tag) // '/^a$/ para resultados estrictos (muy bajo porcentaje de acierto)
            //console.log(matchResult)
            if (matchResult >= 0) {
                tags = tags.concat(tag + " "); //video tag found
            }
        });
        findVideoTags(tags);
    }

    return (
        <PageComponent title={'Procesador de partituras'}>
            <div className="space-y-6 bg-white px-4 py-2 sm:p-6 rounded-md">
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
                        <img
                            src={imageData}
                            alt=""
                            className="object-cover"
                        />
                    </div>
                </div>
                {/*Sheet*/}
                <div className='flex items-center align-center justify-center'>
                    <button
                        type="button"
                        className="flex relative rounded-md border border-purple-300 bg-purple py-2 px-3 text-sm
                                    font-medium leading-4 text-white-700 shadow-sm hover:bg-purple-300 focus:outline-none
                                    focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute left-0 top-0 right-0 bottom-0 opacity-0"
                            onChange={onImageChoose} />
                        Examinar
                    </button>
                    {imageData && <button
                        type="button"
                        className="flex relative ml-5 rounded-md 
                            bg-purple-700 px-3 py-1.5 text-sm font-semibold 
                            leading-6 text-white shadow-sm hover:bg-purple-400 focus-visible:outline 
                            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                        onClick={handleResult}
                    >
                        Analizar Partitura
                    </button>}
                </div>
                {status &&
                    <div className="text-center justify-center play-detail-list u-relative bg-purple-800 rounded-md mr-1 ml-1 mt-1 mb-1 flex">
                        <div className='play-detail px-4 py-4 text-center justify-center' >
                            {loadingOCR && <span className='play-detail__title' >
                                <b>Análisis OCR:</b> Analizando etiquetas en la partitura...
                            </span>}
                            {!loadingOCR && <span className='play-detail__title'>
                                <b>Análisis OCR:</b> Procesamiento de etiquetas completo
                            </span>}
                            {/*loadingNoteMap && <span className='play-detail__title' >
                                <b>Análisis OMR:</b> Analizando nota de mapas de la partitura...
                            </span>}
                            {!loadingNoteMap && <span className='play-detail__title' >
                                <b>Análisis OMR:</b> Procesamiento de nota de mapas completo
                </span>*/}
                        </div>
                    </div>
                }
                {/*noteMap &&
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6 text-center">
                        <label className="block text-md font-medium leading-6 text-gray-900">
                            Mapa de Notas:
                        </label>
                        {noteMap}
                    </div>

            */}
                {!!ocrResult &&
                    <div>
                        {videoList.length > 0 && <label className="block text-sm font-medium leading-6 text-gray-900">
                            Estos videos podrían servirle para aprender esta partitura:
                        </label>}
                        {
                            videoList.map((video, idx) => (
                                <ArchiveDetail
                                    video={video}
                                    key={idx}
                                    order={idx}
                                    currentUser={currentUser}
                                    bandera={1} />
                            ))
                        }
                    </div>
                }
            </div>
        </PageComponent >
    )
}
