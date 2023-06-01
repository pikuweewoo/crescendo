import { useEffect, useState } from "react";
import PageComponent from "../components/PageComponent";
import { useNavigate, useParams } from "react-router-dom";
import TButton from "../components/core/TButton";
import axiosClient from "../axios";
import { useStateContext } from "../contexts/ContextProvider";

export default function UserView() {
    const { currentUser } = useStateContext();
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState({ __html: '' });
    const [loading, setLoading] = useState(false);
    const { showToast } = useStateContext();
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        user_role_id: 2,
        teacher_id: currentUser.id
    });
    const [optionsState, setOptionsState] = useState("");

    const onSubmit = (ev) => {
        ev.preventDefault();
        setUser({ ...user, teacher_id: currentUser.id })
        setError({ __html: '' })
        const payload = { ...user };
        let res = null;
        if (id) {
            res = axiosClient.put(`/user/${id}`, payload);
        } else {
            res = axiosClient.post('/user', payload);
        }
        res.then((res) => {
            if (currentUser.user_role_id == 1) {
                navigate('/students');
            }else{
                navigate('/users');
            }
            if (id) {
                showToast('El alumno fue exitosamente actualizado.')
            } else {
                showToast('El alumno fue exitosamente creado.')
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

    useEffect(() => {
        if (id) {
            setLoading(true)
            axiosClient.get(`/user/${id}`)
                .then(({ data }) => {
                    setUser(data.data)
                    setOptionsState(data.data.user_role_id)
                    setLoading(false)
                })
        }
    }, [])

    return (
        <PageComponent
            title={!id ? "Crear nuevo alumno" : 'Actualizar alumno'}>
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
                            <label htmlFor="full-name" className="block text-sm font-medium leading-6 text-gray-900">
                                Nombre completo
                            </label>
                            <div className="mt-2">
                                <input
                                    id="full-name"
                                    name="name"
                                    type="text"
                                    required
                                    value={user.name}
                                    onChange={(ev) =>
                                        setUser({ ...user, name: ev.target.value })
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Nombre completo"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium leading-6 text-gray-900">
                                Correo electronico
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={user.email}
                                    onChange={(ev) =>
                                        setUser({ ...user, email: ev.target.value })
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Correo electronico"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Contraseña
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    onChange={(ev) =>
                                        setUser({ ...user, password: ev.target.value })
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Contraseña"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password-confirmation" className="block text-sm font-medium leading-6 text-gray-900">
                                    Confirmar contraseña
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password-confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    required
                                    onChange={(ev) =>
                                        setUser({ ...user, password_confirmation: ev.target.value })
                                    }
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Confirmar contraseña"
                                />
                            </div>
                        </div>
                        {!currentUser.user_role_id == 1 && (
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="user-role" className="block text-sm font-medium leading-6 text-gray-900">
                                        Rol de usuario
                                    </label>
                                </div>
                                <select
                                    id="user-role"
                                    name="user_role"
                                    onChange={(ev) =>
                                        setUser({ ...user, user_role_id: ev.target.value },
                                            setOptionsState(ev.target.value))
                                    }
                                    value={optionsState}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md
                            shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm">
                                    <option value="">Seleccione una opcion</option>
                                    <option value="1">Docente</option>
                                    <option value="2">Alumno</option>
                                </select>

                            </div>
                        )}
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
