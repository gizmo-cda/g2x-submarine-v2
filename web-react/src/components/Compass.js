import React from 'react';
import Background from './Background'

class Compass extends React.Component {
    static defaultProps = {
        width: 100,
        height: 100,
        color: "rgb(255, 128, 0)"
    };

    render() {
        let padding     = 20,
            width       = this.props.width,
            height      = this.props.height,
            half_width  = width * 0.5,
            half_height = height * 0.5,
            origin      = `translate(${half_width}, ${half_height})`,
            radius      = (Math.min(width, height) - padding) * 0.5 - 1,
            color       = this.props.color,
            offset      = `translate(${radius - 6 - 1}, 0)`;

        return (
            <svg width={width} height={height}>
                <Background />
                <g transform={origin}>
                    <circle r={radius} stroke={color} strokeWidth={1} fill="none"/>
                    <g transform={this.props.direction}>
                        <g transform={offset}>
                            <polygon points="6,0 0,4 0,-4" fill={color}/>
                        </g>
                    </g>
                </g>
            </svg>
        )
    }
}

export default Compass;
