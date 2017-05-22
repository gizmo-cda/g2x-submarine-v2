import React from 'react';
import Background from './Background'
import Label from './Label';

class LineChart extends React.Component {
    static defaultProps = {
        x: 10,
        y: 10,
        width: 100,
        height: 100,
        padding: 10,
        data: [],
        path_color: "rgb(255,128,0)",
        label: ""
    };

    render() {
        let x          = this.props.x,
            y          = this.props.y,
            width      = this.props.width,
            height     = this.props.height,
            data       = this.props.data,
            color      = this.props.path_color,
            label_text = this.props.label;

        var path_string = "";

        if (data.length > 0) {
            path_string = "M" + data.map(p => `${p[0]},${p[1]}`).join(" ");
        }

        return (
            <svg x={x} y={y} width={width} height={height}>
                <Background />
                <path d={path_string} stroke={color} fill="none" />
                <Label x={width * 0.5} y={height - 1} alignment="center">{label_text}</Label>
            </svg>
        )
    }
}

export default LineChart;
