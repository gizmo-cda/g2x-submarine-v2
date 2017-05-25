import React from 'react';
import Label from './Label';

let directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW"
];

class Compass extends React.Component {
    static defaultProps = {
        width: 100,
        height: 100,
        color: "rgb(255, 128, 0)",
        pointer_color: "rgb(200, 200, 200)",
        direction: 0
    };

    render() {
        let padding     = 25,
            width       = this.props.width,
            height      = this.props.height,
            half_width  = width * 0.5,
            half_height = height * 0.5,
            origin      = `translate(${half_width}, ${half_height})`,
            radius      = (Math.min(width, height) - padding) * 0.5 - 1,
            color       = this.props.color,
            offset      = `translate(${radius - 6 - 1}, 0)`;

        let pointerRotation = `rotate(${this.props.direction - 90})`;

        let quadrantSize = 360 / directions.length;
        let index = Math.floor((this.props.direction / quadrantSize) + 0.5) % directions.length;
        let compassText = directions[index];

        return (
            <svg className="compass" width={width} height={height}>
                <g transform={origin}>
                    <circle r={radius} stroke={color} strokeWidth={1} fill="none"/>
                    <g transform={pointerRotation}>
                        <g transform={offset}>
                            <polygon points="6,0 0,4 0,-4" fill={this.props.pointer_color}/>
                        </g>
                    </g>
                </g>
                <Label x={half_width} y={half_height + 7} alignment="middle">{compassText}</Label>
            </svg>
        )
    }
}

export default Compass;
