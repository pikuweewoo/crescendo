import React from 'react'

export default function MeterScales() {
    let content = [];
    for (let i = 0; i <= 10; i++) {
        const rotation = { transform: "rotate(" + (i * 9 - 45) + "deg)" };
        if (i % 5 === 0) {
            content.push(<div key={i} className='meter-scale meter-scale-strong' style={rotation} ></div>)
        } else {
            content.push(<div key={i} className='meter-scale' style={rotation} ></div>)
        }
    }
    return (
        <div>{content}</div>
    )
}
