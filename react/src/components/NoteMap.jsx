import { TrashIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from "uuid";

export default function NoteMap({ notemap, onNoteMapUpdate }) {
    const [noteMap, setNoteMap] = useState([...notemap]);

    const addQuestion = (index) => {
        index = index !== undefined ? index : noteMap.length
        noteMap.splice(index, 0, {
            id: uuidv4(),
            data: ""
        })
        setNoteMap([...noteMap]);
        onNoteMapUpdate(noteMap)
    };

    const questionChange = (question) => {
        if (!question) return;
        const newNoteMap = noteMap.map((q) => {
            if (q.id == question.id) {
                return { ...question };
            }
            return q;
        });
        setNoteMap(newNoteMap);
        onNoteMapUpdate(newNoteMap)
    };

    const deleteQuestion = (question) => {
        const newNoteMap = noteMap.filter((q) => q.id !== question.id);
        setNoteMap(newNoteMap);
        onNoteMapUpdate(newNoteMap)
    };

    useEffect(() => {
        setNoteMap(notemap);
    }, [notemap]);

    return (
        <>
            <div>
                <h4 className="text-sm text-gray-700 font-semibold mb-1 flex justify-between items-center">
                    Mapa de notas
                    <button
                        onClick={addQuestion}
                        type="button" className="flex items-center text-xs 
                                py-1 px-2 rounded text-white bg-purple-600 hover:bg-purple-700">Añadir</button>
                </h4>
                {noteMap.length ? (
                    <div>
                        {noteMap.map((op, ind) => (
                            <div key={ind} className="flex items-center mb-1">
                                {(ind+1 == 1) ? (
                                    <span className="w-12 text-sm text-purple-800" style={{ fontWeight: 'bold' }}>Datos</span>
                                ):(
                                    <span className="w-6 text-sm text-purple-800" style={{ fontWeight: 'bold' }}>{ind}</span>
                                )}
                                <input
                                    type="text"
                                    value={op.data}
                                    onInput={(ev) => { op.data = ev.target.value, setNoteMap({ ...noteMap }), questionChange(noteMap) }}
                                    className="w-full rounded-sm py-1 px-2 text-xs
                                            border border-gray-300 focus:border-indigo-500" />
                                <button
                                    type="button"
                                    onClick={ev => { deleteQuestion(op) }}
                                    className="h-6 w-6 rounded-full flex items-center justify-center border border-transparent
                                            transition-colors hover:border-red-100">
                                    <TrashIcon className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-xs text-gray-600 text-center py-3">
                        Esta leccion aun no tiene un mapa de notas definido.
                    </div>
                )}
            </div>
        </>
    )
}
