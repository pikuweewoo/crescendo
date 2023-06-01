import { useEffect, useState } from "react";

export default function StudentLessonList({ lesson, onCheckboxUpdate }) {
    let [status, setStatus] = useState(false);
    const [sheet, setSheet] = useState([lesson]);
    function onCheckboxChange(ev) {
        if (ev.target.checked) {
            lesson.status = 1
        } else {
            lesson.status = 0;
        }     
        onCheckboxUpdate(lesson)
    }

    useEffect(() => {
        if (lesson.status == 1) {
            setStatus(true)
        } else {
            setStatus(false)
        }
    }, [])
    return (
        <div className="flex py-1">
            <input
                id={lesson.id}
                checked={status}
                onChange={(ev) => {onCheckboxChange(ev), setStatus(ev.target.checked)}}
                type="checkbox"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
            <label
                htmlFor={lesson.id}
                className="ml-3 block text-sm font-medium text-gray-900">
                {lesson.title}
            </label>
        </div>

    )
}