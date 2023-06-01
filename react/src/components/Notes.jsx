import {
    frequencyFromNoteNumber,
} from "./Helpers";

const Notes = ({noteStrings, changeActiveNote}) => {
    let content = [];
    const minOctave = 1;
    const maxOctave = 8;

    for (var octave = minOctave; octave <= maxOctave; octave += 1) {
        for (var n = 0; n < 12; n += 1) {
            const note = <div
                key={12 * (octave + 1) + n}
                //onClick={(ev) => activateNote(ev.target.getAttribute('data-value'))}
                onClick={changeActiveNote}
                className='note'
                data-name={noteStrings[n]}
                
                data-value={12 * (octave + 1) + n}
                data-octave={octave.toString()}
                data-frequency={frequencyFromNoteNumber(12 * (octave + 1) + n)}
            >
                {noteStrings[n][0]}
                <span className='note-sharp'>{noteStrings[n][1] || ""}</span>
                <span className='note-octave'>{octave}</span>
            </div>
            
            content.push(note)
        }
    }
    return (
        <div>{content}</div>
    )
}

export default Notes;