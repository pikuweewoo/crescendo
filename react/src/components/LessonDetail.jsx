import React from 'react'
import TButton from './core/TButton'
import { LockClosedIcon, PencilIcon, PlayIcon, TrashIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import moment from 'moment'
moment.locale('en', {
    relativeTime : {
        past : 'hace %s',
        s : 'unos segundos',
        m : 'un minuto',
        mm : '%d minutos',
        h : 'una hora',
        hh : '%d horas',
        d : 'un dia',
        dd : '%d dias',
        M : 'un mes',
        MM : '%d meses',
        y : 'un año',
        yy : '%d años'
    },
});


export default function LessonDetail({ lesson, order, currentpage, onDeleteClick, currentUser }) {
    let dateTimeAgo = 'No accedido todavia'
    let statusColor = 'bg-purple-500'    

    let array = [];
    if (currentUser.user_role_id == 2) {
        if (lesson.last_accessed_at) {
            moment.locale('es');
            dateTimeAgo = moment(new Date(lesson.last_accessed_at)).fromNow();
        }
        if (lesson.status == 1) {
            statusColor = 'bg-purple-800'
        }
        let stars = 1;
        if (lesson.score > 84) {
            stars = 5;
        } else {
            if (lesson.score > 69) {
                stars = 4;
            } else {
                if (lesson.score > 54) {
                    stars = 3;
                } else {
                    if (lesson.score > 39) {
                        stars = 2;
                    } else {
                        if (lesson.score > 24) {
                            stars = 2;
                        } else {
                            stars = 1;
                        }
                    }
                }
            }
        }
        for (let i = 0; i < stars; i++) {
            array.push(<StarIcon key={i} className='w-4 h-4 ml-1' style={{color: '#fc2'}}/>)
        }
    } else {
        statusColor = 'bg-purple-800'
    }
    return (
        <div className={"play-detail-list u-relative rounded-md mr-1 ml-1 mt-1 mb-1 " + statusColor}>
            <div className="play-detail">
                <div className="play-detail__group play-detail__group--top">
                    <div className="play-detail__icon play-detail__icon--main">
                        <div className="score-rank score-rank--full score-rank--S">
                        </div>
                    </div>
                    <div className="play-detail__detail">
                        <a className="play-detail__title u-ellipsis-overflow">
                            <b>{(currentpage - 1) * 10 + (order + 1)}. {lesson.title}</b>
                            <small className="play-detail__artist">{lesson.description}</small>
                        </a>
                        {currentUser.user_role_id === 2 &&
                            <div className="play-detail__beatmap-and-time">
                                {lesson.current_progress == 'Completado' && <span className="play-detail__beatmap"><b>{lesson.current_progress}</b></span>}
                                {lesson.current_progress == 'Incompleto' && lesson.status == 1 && <span className="play-detail__beatmap"><b className='text-purple-400'>{lesson.current_progress}</b></span>}
                                {lesson.current_progress == 'Incompleto' && lesson.status == 0 && <span className="play-detail__beatmap"><b className='text-purple-200'>Bloqueado</b></span>}
                                <span className="play-detail__time">{dateTimeAgo}</span>
                            </div>
                        }
                    </div>
                    {currentUser.user_role_id === 1 &&
                        <div className='flex'>
                            <TButton to={`/lessons/${lesson.id}`} circle link color='indigo'>
                                <PencilIcon className="w-5 h-5 mr-2" />
                            </TButton>
                            <TButton onClick={ev => onDeleteClick(lesson.id)} circle link color="red">
                                <TrashIcon className="w-6 h-6 ml-2" />
                            </TButton>
                        </div>}
                    {currentUser.user_role_id === 2 && (
                        lesson.status == 1 ?
                            (
                                <TButton to={`/lessons/play/${lesson.id}`} color='indigo'>
                                    <PlayIcon className="h-6 w-6" />
                                </TButton>
                            ) : (
                                <div style={{
                                    pointerEvents: 'none'
                                }}>
                                    <TButton color='indigo'>
                                        <LockClosedIcon className="h-6 w-6" />
                                    </TButton>
                                </div>
                            )
                    )}
                </div>
                {currentUser.user_role_id === 2 &&
                    <div className="play-detail__group play-detail__group--bottom">
                        {lesson.score > 0 &&
                            <div className="play-detail__score-detail play-detail__score-detail--score">
                                <div className="play-detail__icon play-detail__icon--extra flex">
                                    {array.map(star => star)}
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}
