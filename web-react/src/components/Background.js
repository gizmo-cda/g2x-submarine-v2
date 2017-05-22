import React from 'react';

class Background extends React.Component {
	static defaultProps = {
        color: "rgb(255,255,255)",
        opacity: 0.4,
    };

	render() {
		let color = this.props.color;
		let opacity = this.props.opacity;

		return (
			<rect width="100%" height="100%" fill={color} fillOpacity={opacity}/>
		)
	}
}

export default Background;
