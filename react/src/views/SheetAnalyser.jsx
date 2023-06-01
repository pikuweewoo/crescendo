import { useEffect, useState } from 'react'
import PageComponent from '../components/PageComponent'
import { PhotoIcon } from '@heroicons/react/24/outline'
import TButton from '../components/core/TButton';
import axiosClient from '../axios';
import { useStateContext } from '../contexts/ContextProvider';
import { useNavigate, useParams } from 'react-router-dom';
import NoteMap from '../components/NoteMap';

export default function SheetAnalyser() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showToast } = useStateContext();
    const [sheet, setSheet] = useState({
        title: "",
        slug: "",
        description: "",
        image: null,
        image_url: null,
        image_type: null,
        notemap: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onImageChoose = (ev) => {
        const file = ev.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setSheet({
                ...sheet,
                image: file,
                image_url: reader.result,
                image_type: file.type
            })
            ev.target.value = ""
        }
        reader.readAsDataURL(file);
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        const payload = { ...sheet };
        if (payload.image) {
            payload.image = payload.image_url;
        }
        payload.notemap = JSON.stringify(payload.notemap);
        delete payload.image_url;
        let res = null;
        if (id) {
            res = axiosClient.put(`/sheet/${id}`, payload);
        } else {
            res = axiosClient.post('/sheet', payload);
        }
        res.then((res) => {
            //console.log(res)
            navigate('/lessons');
            if (id) {
                showToast('La leccion fue exitosamente actualizada')
            } else {
                showToast('La leccion fue exitosamente creada')
            }
        })
            .catch((err) => {
                if (err && err.response) {
                    setError(err.response.data.message);
                }
                console.log(err, err.response);
                //navigate('/lessons');
            });
    }

    function onNoteMapUpdate(notemap) {
        setSheet({ ...sheet, notemap })
    }

    useEffect(() => {
        if (id) {
            setLoading(true)
            axiosClient.get(`/sheet/${id}`)
                .then(({ data }) => {
                    data.data.notemap = JSON.parse(data.data.notemap)
                    setSheet(data.data)
                    setLoading(false)
                })
        }
    }, [])

    return (
        <PageComponent title={!id ? "Crear nueva leccion" : 'Actualizar leccion'}>
            {loading && <div className="text-center text-lg">Cargando...</div>}
            {!loading && <form action="#" method="POST" onSubmit={onSubmit}>
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                        {/*Sheet*/}
                        <label className="block font-medium text-gray-700">
                            Cargar partitura
                        </label>
                        <div className='flex items-center align-center justify-center'>
                            <div className="items-center" style={{
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
                                {!sheet.image_url && (
                                    <span className="flex justify-center items-center text-gray-400 h-20 w-20
                                    overflow-hidden square-full bg-gray-100">
                                        <PhotoIcon className="w-70 h-70" />
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className='flex items-center align-center justify-center'>
                            <button
                                type="button"
                                className="flex relative ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm
                                    font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none
                                    focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute left-0 top-0 right-0 bottom-0 opacity-0"
                                    onChange={onImageChoose} />
                                Examinar
                            </button>
                        </div>
                        {/*Sheet*/}

                        {/*Title*/}
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700">
                                Titulo de la partitura
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                value={sheet.title}
                                onChange={(ev) =>
                                    setSheet({ ...sheet, title: ev.target.value })
                                }
                                placeholder="Titulo de la partitura"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500
                                focus:ring-indigo-500 sm:text-sm"/>
                        </div>
                        {/*Title*/}

                        {/*Description*/}
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700">
                                Descripcion
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                value={sheet.description || ''}
                                onChange={(ev) =>
                                    setSheet({ ...sheet, description: ev.target.value })
                                }
                                placeholder="Descripcion de la partitura (artista, libro, numero de leccion, etc.)"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500
                                focus:ring-indigo-500 sm:text-sm">
                            </textarea>
                        </div>
                        {/*Description*/}

                        <NoteMap notemap={sheet.notemap} onNoteMapUpdate={onNoteMapUpdate} />
                        <div className="align-center justify-center flex px-4 py-3 text-right sm:px-6">
                            <TButton color='indigo'>
                                Guardar
                            </TButton>
                        </div>
                    </div>
                </div>
            </form>}
        </PageComponent>

    )
}
