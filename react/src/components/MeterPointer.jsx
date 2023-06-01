import React from 'react'

export default function MeterPointer(deg) {
    return (
        <div id="pointer" className='meter-pointer' style={{
            transform: 'rotate(' + deg + 'deg)'
        }} >

        </div>
    )
}
