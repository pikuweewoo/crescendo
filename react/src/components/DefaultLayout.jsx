import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, UserIcon, XMarkIcon, ArrowLeftOnRectangleIcon, BookOpenIcon, CameraIcon, FolderIcon, HomeIcon, MusicalNoteIcon } from '@heroicons/react/24/outline'
import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import axiosClient from '../axios'
import Toast from './Toast'

const navigationTeacher = [
    { name: 'Inicio', to: '/' },
    { name: 'Lecciones', to: '/lessons' },
    { name: 'Alumnos', to: '/students' },
    { name: 'Repositorio', to: '/archive' },
    { name: 'Procesador', to: '/partituras' }
]

const navigationStudent = [
    { name: 'Inicio', to: '/' },
    { name: 'Lecciones', to: '/lessons' },
    { name: 'Afinador', to: '/tuner' },
    { name: 'Repositorio', to: '/archive' },
    { name: 'Procesador', to: '/partituras' }
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function DefaultLayout() {
    const { currentUser, userToken, setCurrentUser, setUserToken } = useStateContext();

    if (!userToken) {
        return <Navigate to="login" />
    }

    const logout = (ev) => {
        ev.preventDefault();
        axiosClient.post('/logout').then(res => {
            setCurrentUser({});
            setUserToken(null);
        })
    };

    useEffect(() => {
        axiosClient.get('/me')
            .then(({ data }) => {
                setCurrentUser(data)
            })
    }, [])

    return (
        <>
            <div className="min-h-full bg-purple-100">
                <Disclosure as="nav" className="bg-purple-900 hidden lg:block md:block">
                    {({ open }) => (
                        <>
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex h-16 items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-8 w-8"
                                                src="/src/assets/images/logo.png"
                                                alt="Crescendo"
                                            />
                                        </div>
                                        <div className="hidden md:block">
                                            {currentUser.user_role_id === 1 &&
                                                <div className="ml-10 flex items-baseline space-x-4">
                                                    {navigationTeacher.map((item) => (
                                                        <NavLink
                                                            key={item.name}
                                                            to={item.to}
                                                            className={({ isActive }) => classNames(
                                                                isActive
                                                                    ? 'bg-purple-950 text-white'
                                                                    : 'text-purple-200 hover:bg-purple-950 hover:text-white',
                                                                'rounded-md px-3 py-2 text-sm font-medium'
                                                            )}
                                                        >
                                                            {item.name}
                                                        </NavLink>
                                                    ))}
                                                </div>}
                                            {currentUser.user_role_id === 2 &&
                                                <div className="ml-10 flex items-baseline space-x-4">
                                                    {navigationStudent.map((item) => (
                                                        <NavLink
                                                            key={item.name}
                                                            to={item.to}
                                                            className={({ isActive }) => classNames(
                                                                isActive
                                                                    ? 'bg-purple-950 text-white'
                                                                    : 'text-purple-200 hover:bg-purple-950 hover:text-white',
                                                                'rounded-md px-3 py-2 text-sm font-medium'
                                                            )}
                                                        >
                                                            {item.name}
                                                        </NavLink>
                                                    ))}
                                                </div>}
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">
                                            <Menu as="div" className="relative ml-3">
                                                <div className='flex'>
                                                    <div className='mr-3 py-2 text-sm font-medium leading-none text-white'>{currentUser.name}</div>
                                                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-purple-950 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <UserIcon className='w-9 h-9 bg-black/25 p-2 rounded-full text-white' />
                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        <Menu.Item>
                                                            <a
                                                                href="#"
                                                                onClick={(ev) => logout(ev)}
                                                                className={'block px-4 py-2 text-sm text-gray-700'}
                                                            >
                                                                Salir
                                                            </a>
                                                        </Menu.Item>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>
                                    </div>

                                    <div className="-mr-2 flex md:hidden">
                                        {/* Mobile menu button */}
                                        {/*<Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-purple-950 p-2 text-gray-400 hover:bg-purple-950 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="sr-only">Abrir menu</span>
                                            {open ? (
                                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                            )}
                                            </Disclosure.Button>*/}
                                    </div>
                                </div>
                            </div>
                            <Disclosure.Panel className="md:hidden">
                                {currentUser.user_role_id === 1 &&
                                    <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                                        {navigationTeacher.map((item) => (
                                            <NavLink
                                                key={item.name}
                                                to={item.to}
                                                className={({ isActive }) => classNames(
                                                    isActive ? 'bg-purple-950 text-white' : 'text-purple-200 hover:bg-purple-700 hover:text-white',
                                                    'block rounded-md px-3 py-2 text-base font-medium'
                                                )}
                                            >
                                                {item.name}
                                            </NavLink>
                                        ))}
                                    </div>}
                                {currentUser.user_role_id === 2 &&
                                    <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                                        {navigationTeacher.map((item) => (
                                            <NavLink
                                                key={item.name}
                                                to={item.to}
                                                className={({ isActive }) => classNames(
                                                    isActive ? 'bg-purple-950 text-white' : 'text-purple-200 hover:bg-purple-700 hover:text-white',
                                                    'block rounded-md px-3 py-2 text-base font-medium'
                                                )}
                                            >
                                                {item.name}
                                            </NavLink>
                                        ))}
                                    </div>}
                                <div className="border-t border-purple-950 pb-3 pt-4">
                                    <div className="flex items-center px-5">
                                        <div className="flex-shrink-0">
                                            <UserIcon className='w-9 h-9 bg-black/25 p-2 rounded-full text-white' />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium leading-none text-white">{currentUser.name}</div>
                                            <div className="text-sm font-medium leading-none text-gray-400">{currentUser.email}</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 space-y-1 px-2">
                                        <Disclosure.Button
                                            as="a"
                                            href="#"
                                            onClick={(ev) => logout(ev)}
                                            className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-gray-700 hover:text-white"
                                        >
                                            Salir
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
                {/*Mobile NavBar*/}
                <div className='md:hidden'>
                    <div className="fixed bottom-0 left-0 z-50 w-full h-14 bg-white border-t border-purple-900 dark:bg-purple-900 dark:border-purple-900">
                        <div className='mobilenavbarpurr'>
                            <div className='icons bg-purple-900'>
                                {currentUser.user_role_id === 1 &&
                                    <>
                                        {navigationTeacher.map((item, idx) => (
                                            <NavLink key={item.name} to={item.to} name={item.name}
                                                className={({ isActive }) => classNames(
                                                    isActive ? 'bg-purple-950 rounded-md text-white' : ''
                                                )}>
                                                <input className="purr" type="radio" name={item.name} id={idx} />
                                                <label htmlFor={item.name} className='icon'>
                                                    {item.name == 'Inicio' &&
                                                        <HomeIcon className='innericon h-5 w-5' />
                                                    }
                                                    {item.name == 'Lecciones' &&
                                                        <BookOpenIcon className='innericon h-5 w-5' />
                                                    }
                                                    {item.name == 'Alumnos' &&
                                                        <UserIcon className='innericon h-5 w-5' />
                                                    }
                                                    {item.name == 'Repositorio' &&
                                                        <FolderIcon className='innericon h-5 w-5' />
                                                    }
                                                    {item.name == 'Procesador' &&
                                                        <CameraIcon className='innericon h-5 w-5' />
                                                    }
                                                    <span className='hidden lg:block md:block innericontext' >{item.name}</span>
                                                </label>
                                            </NavLink>
                                        ))}
                                    </>
                                }
                                {currentUser.user_role_id === 2 &&
                                    <>
                                        {navigationStudent.map((item, idx) => (
                                            <NavLink key={item.name} to={item.to} name={item.name}
                                                className={({ isActive }) => classNames(
                                                    isActive ? 'bg-purple-950 rounded-md text-white' : ''
                                                )}>
                                                <input className="purr" type="radio" name={item.name} id={idx} />
                                                <label htmlFor={item.name} className='icon'>
                                                    {item.name == 'Inicio' &&
                                                        <HomeIcon className='innericon h-5 w-5' />
                                                    }
                                                    {item.name == 'Lecciones' &&
                                                        <BookOpenIcon className='innericon h-5 w-5' />
                                                    }
                                                    {item.name == 'Afinador' &&
                                                        <MusicalNoteIcon className='innericon h-5 w-5' />
                                                    }
                                                    {item.name == 'Repositorio' &&
                                                        <FolderIcon className='innericon h-5 w-5' />
                                                    }
                                                    {item.name == 'Procesador' &&
                                                        <CameraIcon className='innericon h-5 w-5' />
                                                    }
                                                    <span className='hidden lg:block md:block innericontext' >{item.name}</span>
                                                </label>
                                            </NavLink>
                                        ))}
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                
                <Outlet />
                <Toast />
            </div>
        </>
    )
}
