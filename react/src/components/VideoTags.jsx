import { TrashIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from "uuid";

export default function VideoTags({ tags, onTagsUpdate }) {
    const [tagMap, setTagMap] = useState([...tags]);

    const addQuestion = (index) => {
        index = index !== undefined ? index : tagMap.length
        tagMap.splice(index, 0, {
            id: uuidv4(),
            data: ""
        })
        setTagMap([...tagMap]);
        onTagsUpdate(tagMap)
    };

    const questionChange = (question) => {
        if (!question) return;
        const newTagMap = tagMap.map((q) => {
            if (q.id == question.id) {
                return { ...question };
            }
            return q;
        });
        setTagMap(newTagMap);
        onTagsUpdate(newTagMap)
    };

    const deleteQuestion = (question) => {
        const newTagMap = tagMap.filter((q) => q.id !== question.id);
        setTagMap(newTagMap);
        onTagsUpdate(newTagMap)
    };

    useEffect(() => {
        setTagMap(tags);
    }, [tags]);

    return (
        <>
            <div>
                <h4 className="text-sm text-gray-700 font-semibold mb-1 flex justify-between items-center">
                    Lista de etiquetas
                    <button
                        onClick={addQuestion}
                        type="button" className="flex items-center text-xs 
                                py-1 px-2 rounded text-white bg-purple-600 hover:bg-purple-700">Añadir</button>
                </h4>
                {tagMap.length ? (
                    <div>
                        {tagMap.map((op, ind) => (
                            <div key={ind} className="flex items-center mb-1">
                                <span className="w-6 text-sm text-purple-800" style={{ fontWeight: 'bold' }}>{ind + 1}</span>
                                <input
                                    type="text"
                                    value={op.data}
                                    onInput={(ev) => { op.data = ev.target.value, setTagMap({ ...tagMap }), questionChange(tagMap) }}
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
                        Este video aun no tiene una lista de etiquetas definida.
                    </div>
                )}
            </div>
        </>
    )
}
