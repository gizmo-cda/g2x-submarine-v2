import React from 'react';

class Thrusters extends React.Component {
	static defaultProps = {
		width: 100,
		height: 100,
		color: "rgb(255, 128, 0)"
	};

	render() {
		let width  = this.props.width,
			height = this.props.height,
			color  = this.props.color,
			radius = 8;

		return (
			<svg className="thrusters" width={width} height={height}>
				<g stroke={this.props.color} fill="none">
					<circle cx="15" cy="30" r={radius}/>
					<circle cx="35" cy="30" r={radius}/>
					<circle cx="65" cy="30" r={radius}/>
					<circle cx="85" cy="30" r={radius}/>
					<circle cx="50" cy="70" r={radius}/>
				</g>
			</svg>
		)
	}
}

export default Thrusters;
