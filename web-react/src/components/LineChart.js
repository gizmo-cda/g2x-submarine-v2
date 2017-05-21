import React from 'react';
import Label from './Label';

class LineChart extends React.Component {
    static defaultProps = {
        x: 10,
        y: 10,
        width: 100,
        height: 100,
        background_color: "rgb(255,255,255)",
        background_opacity: 0.6,
        padding: 10,
        data: [],
        path_color: "rgb(255,128,0)",
        label: "-- ft"
    };

    render() {
        let x                  = this.props.x,
            y                  = this.props.y,
            width              = this.props.width,
            height             = this.props.height,
            background_color   = this.props.background_color,
            background_opacity = this.props.background_opacity,
            data               = this.props.data,
            path_color         = this.props.path_color,
            label_text         = this.props.label;

        var path_string = "";

        if (data.length > 0) {
            path_string = "M" + data.map(p => `${p[0]},${p[1]}`).join(" ");
        }

        return (
            <svg x={x} y={y} width={width} height={height}>
                <rect width="100%" height="100%" fill={background_color} fillOpacity={background_opacity} />
                <path d={path_string} stroke={path_color} fill="none" />
                <Label x={width * 0.5} y={height} alignment="center">{label_text}</Label>
            </svg>
        )
    }
}

export default LineChart;
