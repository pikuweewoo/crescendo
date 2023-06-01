import React, { useEffect, useState } from 'react'
import PageComponent from '../components/PageComponent'
import axiosClient from '../axios';
import TButton from '../components/core/TButton';
import { PencilIcon, PlusCircleIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline';
import { useStateContext } from '../contexts/ContextProvider';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showToast } = useStateContext();

    const getUsers = () => {
        setLoading(true);
        axiosClient.get('/users').then(({ data }) => {
            setUsers(data.data);
            setLoading(false);
        });
    }

    const onDeleteClick = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            axiosClient.delete(`/user/${id}`)
                .then(() => {
                    getUsers()
                    showToast('The user was succesfully deleted.')
                })
        }
    }

    useEffect(() => {
        getUsers()
    }, [])


    return (
        <PageComponent title="Users"
            buttons={(
                <TButton color="green" to="/users/create">
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Create new
                </TButton>)
            }
        >
            {loading && <div className="text-center text-lg">Loading...</div>}
            {!loading && <div className="overflow-hidden rounded-md px-2 ">
                <div className="space-y-6 rounded-md bg-white px-5 py-2">
                    <ul role="list" className="divide-y divide-gray-100">
                        {users.map(user => (
                            <li key={user.email} className="flex justify-between gap-x-6 py-5">
                                <div className="flex gap-x-4">
                                    <UserIcon className='w-12 h-12 bg-purple-700 p-2 rounded-full flex-none text-white' />
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-gray-900">{user.name}</p>
                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="text-sm leading-6 text-gray-900 font-bold">
                                        {user.user_role_id ? (
                                            <>{user.user_role_id === 1 ? 'Teacher' : 'Student'}</>
                                        ) : (
                                            <>{'Role unassigned'}</>
                                        )}
                                    </p>
                                    {/*<div className="mt-1 flex items-center gap-x-1.5">
                                        <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        </div>
                                        <p className="text-xs leading-5 text-gray-500">Online</p>
                                    </div>*/}
                                    <div className='flex'>
                                        <TButton to={`/users/${user.id}`} circle link color='indigo'>
                                            <PencilIcon className="w-5 h-5 mr-2" />
                                        </TButton>
                                        <TButton onClick={ev => onDeleteClick(user.id)} circle link color="red">
                                            <TrashIcon className="w-6 h-6" />
                                        </TButton>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>}
        </PageComponent>

    )
}
