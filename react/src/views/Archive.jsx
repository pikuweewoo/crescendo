import React, { useEffect, useState } from 'react'
import PageComponent from '../components/PageComponent'
import ArchiveDetail from '../components/ArchiveDetail'
import TButton from '../components/core/TButton'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { useStateContext } from '../contexts/ContextProvider'
import axiosClient from '../axios'

export default function Archive() {
    const { showToast } = useStateContext();
    const { currentUser } = useStateContext();
    const [videos, setVideos] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(false);

    const onDeleteClick = (id) => {
        if (window.confirm('Estas seguro que quieres eliminar este video?')) {
            axiosClient.delete(`/video/${id}`)
                .then(() => {
                    getVideos()
                    showToast('El video fue exitosamente eliminado.')
                })
        }
    }

    const onPageClick = (link) => {
        getVideos(link.url)
    }

    const getVideos = (url) => {
        url = url || '/videos'
        setLoading(true);
        axiosClient.get(url).then(({ data }) => {
            setVideos(data.data);
            setMeta(data.meta);
            setLoading(false);
        });
    }

    useEffect(() => {
        getVideos()
    }, [])
    return (
        <>
            {currentUser.user_role_id == 1 && (
                <PageComponent title={'Repositorio'}
                    buttons={(
                        <TButton color="green" to="/archive/create">
                            <PlusCircleIcon className="h-5 w-5 mr-2" />
                            Crear nuevo
                        </TButton>)
                    }>
                    {loading && <div className="text-center text-lg">Cargando...</div>}
                    {!loading &&
                        <div className="space-y-6 rounded-md bg-white px-5 py-2">
                            {videos.length === 0 && (
                                <div className="py-8 text-center text-gray-700">
                                    Aun no hay videos en el repositorio.
                                </div>
                            )}
                            {videos.map((video, idx) => (
                                <ArchiveDetail
                                    video={video}
                                    key={idx}
                                    order={idx}
                                    currentpage={meta.current_page}
                                    onDeleteClick={onDeleteClick}
                                    currentUser={currentUser} />
                            ))}
                            {(videos.length > 0 && meta.total > meta.per_page) && <PaginationLinks meta={meta} onPageClick={onPageClick} />}
                        </div>
                    }
                </PageComponent>
            )}
            {currentUser.user_role_id == 2 && (
                <PageComponent title={'Repositorio'}>
                    {loading && <div className="text-center text-lg">Cargando...</div>}
                    {!loading &&
                        <div className="space-y-6 rounded-md bg-white px-5 py-2">
                            {videos.length === 0 && (
                                <div className="py-8 text-center text-gray-700">
                                    Aun no hay videos en el repositorio.
                                </div>
                            )}
                            {videos.map((video, idx) => (
                                <ArchiveDetail
                                    video={video}
                                    key={idx}
                                    order={idx}
                                    currentpage={meta.current_page}
                                    onDeleteClick={onDeleteClick}
                                    currentUser={currentUser} />
                            ))}
                            {(videos.length > 0 && meta.total > meta.per_page) && <PaginationLinks meta={meta} onPageClick={onPageClick} />}
                        </div>
                    }
                </PageComponent>
            )}
        </>
    )

}
