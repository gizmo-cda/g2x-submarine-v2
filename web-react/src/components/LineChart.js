import React from 'react';
import Label from './Label';

class LineChart extends React.Component {
    static defaultProps = {
        x:          10,
        y:          10,
        width:      100,
        height:     100,
        padding:    10,
        data:       [],
        path_color: "rgb(255, 128, 0)",
        point_color: "rgb(200, 200, 200)",
        label:      ""
    };

    render() {
        let x          = this.props.x,
            y          = this.props.y,
            width      = this.props.width,
            height     = this.props.height,
            data       = this.props.data,
            color      = this.props.path_color,
            label_text = this.props.label;

        var path_string = data.length > 0
            ? "M" + data.map(p => `${p[0]},${p[1]}`).join(" ")
            : "";

        return (
            <svg className="lineChart" x={x} y={y} width={width} height={height}>
                <defs>
                    <marker id="point" markerWidth={4} markerHeight={4} refX={2} refY={2}>
                        <circle cx={2} cy={2} r={2} fill={this.props.point_color}/>
                    </marker>
                </defs>
                <path d={path_string} stroke={color} fill="none" markerEnd="url(#point)"/>
                <Label x={width * 0.5} y={height - 1} alignment="middle">{label_text}</Label>
            </svg>
        )
    }
}

export default LineChart;
