import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios";
import { useStateContext } from "../contexts/ContextProvider";

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
        url: ""
    });

    useEffect(() => {
        if (id) {
            setLoading(true)
            axiosClient.get(`/video/${id}`)
                .then(({ data }) => {
                    setVideo(data.data)
                    setLoading(false)
                })
        }
    }, [])

    return (
        <PageComponent
            title={'Reproductor de video'}>
            {loading && <div className="text-center text-lg">Cargando...</div>}
            {!loading &&
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                        {error.__html && (
                            <div className="bg-red-500 text-white py-3 px-3 rounded-lg"
                                dangerouslySetInnerHTML={error}>
                            </div>
                        )}
                        <div>
                            <label htmlFor="video-title" className="block text-sm font-medium leading-6 text-gray-900">
                                <b>Titulo: </b>{video.title}
                            </label>
                        </div>
                        <div>
                            <label htmlFor="video-description" className="block text-sm font-medium leading-6 text-gray-900">
                                <b>Descripcion: </b>{video.description}
                            </label>
                        </div>
                        <div className="justify-center align-center text-center">
                            <label htmlFor="video-url" className="block text-sm font-medium leading-6 text-gray-900">
                                <b>Video</b>
                            </label>
                            <div className="flex ratio-16x9 items-center justify-center align-center text-center">
                                <iframe 
                                src={video.url} 
                                title={video.title} 
                                allowFullScreen={true} 
                                width={'853'} height={'480'}></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </PageComponent>
    )
}
