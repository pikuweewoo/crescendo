import { PlayIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import TButton from "../components/core/TButton";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from '../axios.js';
import PaginationLinks from "../components/PaginationLinks";
import router from "../router";
import LessonDetail from "../components/LessonDetail";

export default function Surveys() {
    const { showToast } = useStateContext();
    const { currentUser } = useStateContext();
    const [sheets, setSheets] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(false);

    const onDeleteClick = (id) => {
        if (window.confirm('Estas seguro que quieres eliminar esta leccion?')) {
            axiosClient.delete(`/sheet/${id}`)
                .then(() => {
                    getSheets()
                    showToast('La leccion fue exitosamente eliminada.')
                })
        }
    }

    const onPageClick = (link) => {
        getSheets(link.url)
    }

    const getSheets = (url) => {
        if (currentUser.user_role_id == 1) {
            url = url || '/sheet'
        } else {
            url = url || '/lessons'
        }
        setLoading(true);
        axiosClient.get(url).then(({ data }) => {
            setSheets(data.data);
            setMeta(data.meta);
            setLoading(false);
        });
    }

    useEffect(() => {
        getSheets()
    }, [])

    return (
        <>
            {currentUser.user_role_id === 1 && (
                <PageComponent
                    title="Lecciones"
                    buttons={(
                        <TButton color="green" to="/lessons/create">
                            <PlusCircleIcon className="h-5 w-5 mr-2 " />
                            Crear nuevo
                        </TButton>
                    )}>
                    {loading && <div className="text-center text-lg">Cargando...</div>}
                    {!loading && <div>
                        {sheets.length === 0 && (
                            <div className="py-8 text-center text-gray-700">
                                No tienes ninguna leccion creada.
                            </div>
                        )}
                        {sheets.map((sheet, idx) => (
                            <LessonDetail
                                lesson={sheet}
                                key={idx}
                                order={idx}
                                currentpage={meta.current_page}
                                onDeleteClick={onDeleteClick}
                                currentUser={currentUser} />
                        ))}
                        {(sheets.length > 0 && meta.total > meta.per_page) && <PaginationLinks meta={meta} onPageClick={onPageClick} />}
                    </div>
                    }
                </PageComponent>
            )}
            {currentUser.user_role_id === 2 &&
                (
                    <PageComponent
                        title="Lecciones">
                        {loading && <div className="text-center text-lg">Cargando...</div>}
                        {!loading && <div>
                            {sheets.length === 0 && (
                                <div className="py-8 text-center text-gray-700">
                                    No tienes ninguna leccion asignada.
                                </div>
                            )}
                            {sheets.map((sheet, idx) => (
                                <LessonDetail
                                    lesson={sheet}
                                    key={idx}
                                    order={idx}
                                    currentpage={meta.current_page}
                                    onDeleteClick={onDeleteClick}
                                    currentUser={currentUser} />
                            ))}
                            {(sheets.length > 0 && meta.total > meta.per_page) && <PaginationLinks meta={meta} onPageClick={onPageClick} />}
                        </div>
                        }
                    </PageComponent>
                )
            }
        </>
    )
}