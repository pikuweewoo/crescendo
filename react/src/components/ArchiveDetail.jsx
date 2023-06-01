import { PencilIcon, TrashIcon, PlayIcon, VideoCameraIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import TButton from './core/TButton'

export default function ArchiveDetail({ video, order, currentpage, onDeleteClick, currentUser, bandera }) {
    const [tags, setTags] = useState(JSON.parse(video.tags));
    if (!bandera) {
        bandera = 0;
    }

    return (
        <div className='px-3'>
            <li className="flex justify-between gap-x-6 py-5">
                <div className="flex gap-x-4">
                    <VideoCameraIcon className='w-12 h-12 bg-purple-700 p-2 rounded-full flex-none text-white' />
                    <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">{video.title}</p>
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                            {video.description} | Etiquetas: {' '}
                            {tags.map((a, idx) => (
                                (idx < (tags.length - 1)) ? (
                                    a.data + ", "
                                ) : (
                                    a.data
                                )
                            ))}
                        </p>
                    </div>
                </div>
                {bandera == 0 ? (
                    <div className="flex flex-col items-end">
                        <div className='flex'>
                            {currentUser.user_role_id === 1 &&
                                <div className='flex'>
                                    <TButton to={`/archive/play/${video.id}`} circle link color='indigo'>
                                        <PlayIcon className="h-6 w-6 mr-2" />
                                    </TButton>
                                    <TButton to={`/archive/${video.id}`} circle link color='indigo'>
                                        <PencilIcon className="w-5 h-5 " />
                                    </TButton>
                                    <TButton onClick={ev => onDeleteClick(video.id)} circle link color="red">
                                        <TrashIcon className="w-6 h-6" />
                                    </TButton>

                                </div>}
                            {currentUser.user_role_id === 2 && (
                                <TButton to={`/archive/play/${video.id}`} color='indigo'>
                                    <PlayIcon className="h-6 w-6" />
                                </TButton>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-end">
                        <div className='flex'>
                            <TButton to={`/archive/play/${video.id}`} color='indigo'>
                                <PlayIcon className="h-6 w-6" />
                            </TButton>
                        </div>
                    </div>
                )
                }
            </li>
        </div>
    )
}
