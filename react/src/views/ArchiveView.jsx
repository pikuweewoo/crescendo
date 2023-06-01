import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import { useNavigate, useParams } from "react-router-dom";
import TButton from "../components/core/TButton";
import axiosClient from "../axios";
import { useStateContext } from "../contexts/ContextProvider";
import VideoTags from "../components/VideoTags";

export default function ArchiveView() {
    const { currentUser } = useStateContext();
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState({ __html: '' });
    const [loading, setLoading] = useState(false);
    const { showToast } = useStateContext();
    const [video, setVideo] = useState({
        title: "",
        description: "",
        url: "",
        tags: []
    });
    
    const onSubmit = (ev) => {
        ev.preventDefault();
        setError({ __html: '' })
        const payload = { ...video };
        payload.tags = JSON.stringify(payload.tags);
        let res = null;
        if (id) {
            res = axiosClient.put(`/video/${id}`, payload);
        } else {
            res = axiosClient.post('/video', payload);
        }
        res.then((res) => {
            navigate('/archive');
            if (id) {
                showToast('The video was succesfully updated.')
            } else {
                showToast('The video was succesfully created.')
            }
        })
            .catch((err) => {
                if (err.response) {
                    const finalErrors = Object.values(err.response.data.errors).reduce((accum, next) => [...next, ...accum], [])
                    setError({ __html: finalErrors.join('<br>') })
                }
                console.log(err, err.response);
            });
    }

    function onTagsUpdate(tags) {
        setVideo({ ...video, tags })
    }

    useEffect(() => {
        if (id) {
            setLoading(true)
            axiosClient.get(`/video/${id}`)
                .then(({ data }) => {
                    data.data.tags = JSON.parse(data.data.tags)
                    setVideo(data.data)
                    setLoading(false)
                })
        }
    }, [])

    return (
        <PageComponent
            title={!id ? "Crear nuevo video" : 'Actualizar video'}>
            {loading && <div className="text-center text-lg">Cargando...</div>}
            {!loading && <form action="#" method="POST" onSubmit={onSubmit}>
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                        {error.__html && (
                            <div className="bg-red-500 text-white py-3 px-3 rounded-lg"
                                dangerouslySetInnerHTML={error}>
                            </div>
                        )}
                        <div>
                            <label htmlFor="video-title" className="block text-sm font-medium leading-6 text-gray-900">
                                Titulo
                            </label>
                            <div className="mt-2">
                                <input
                                    id="video-title"
                                    name="name"
                                    type="text"
                                    required
                                    value={video.title}
                                    onChange={(ev) =>
                                        setVideo({ ...video, title: ev.target.value })
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Titulo"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="video-description" className="block text-sm font-medium leading-6 text-gray-900">
                                Descripcion
                            </label>
                            <div className="mt-2">
                                <input
                                    id="video-description"
                                    name="video-description"
                                    type="text"
                                    required
                                    value={video.description}
                                    onChange={(ev) =>
                                        setVideo({ ...video, description: ev.target.value })
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Descripcion"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="video-url" className="block text-sm font-medium leading-6 text-gray-900">
                                URL
                            </label>
                            <div className="mt-2">
                                <input
                                    id="video-url"
                                    name="url"
                                    type="url"
                                    required
                                    value={video.url}
                                    onChange={(ev) =>
                                        setVideo({ ...video, url: ev.target.value })
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="URL del video"
                                />
                            </div>
                        </div>
                        <VideoTags tags={video.tags} onTagsUpdate={onTagsUpdate} />
                    </div>
                    

                    <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                        <TButton>
                            Guardar
                        </TButton>
                    </div>
                </div>
            </form>}
        </PageComponent>
    )
}
