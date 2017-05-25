import React from 'react';

class Label extends React.Component {
    static defaultProps = {
        x: 0,
        y: 0,
        font_size: 14,
        alignment: "start",
        color: "rgb(200,200,200)"
    }

    render() {
        return (
            <text x={this.props.x} y={this.props.y} fontSize={this.props.font_size} fill={this.props.color} textAnchor={this.props.alignment}>{this.props.children}</text>
        )
    }
}

export default Label;
