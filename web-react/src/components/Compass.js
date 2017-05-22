import React from 'react';
import Background from './Background'

class Compass extends React.Component {
    static defaultProps = {
        color: "rgb(255, 128, 0)"
    };

    render() {
        let color = this.props.color;

        return (
            <svg width={100} height={100}>
                <Background />
                <g transform="translate(50,50)">
                    <circle r={48} stroke={color} strokeWidth={1} fill="none"/>
                    <g transform={this.props.direction}>
                        <g transform="translate(41, 0)">
                            <polygon points="6,0 0,4 0,-4" fill={color}/>
                        </g>
                    </g>
                </g>
            </svg>
        )
    }
}

export default Compass;
