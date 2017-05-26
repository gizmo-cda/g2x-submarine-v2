import React from 'react';

class Thruster extends React.Component {
	static defaultProps = {
		cx: 50,
		cy: 50,
		radius: 10,
		skeletonColor: "rgb(128, 128, 128)",
		forwardColor: "rgb(0, 128, 0)",
		reverseColor: "rgb(192, 64, 64)",
		power: 0
	};

	render() {
		let cx = this.props.cx;
		let cy = this.props.cy;
		let r = this.props.radius;
		let power = this.props.power;
		var d = "";
		var color = "none";

		if (Math.abs(power) === 1.0) {
			// HACK: so we don't have to create two arcs to make a complete circle
			power *= 0.999;
		}

		if (power !== 0.0) {
			let largeArcFlag = Math.abs(power) > 0.5 ? 1 : 0;
			let sweepFlag = power < 0.0 ? 0 : 1;

			let endingAngle = 2.0 * Math.PI * power;
			let ex = cx + r * Math.cos(endingAngle).toFixed(3);
			let ey = cy + r * Math.sin(endingAngle).toFixed(3);

			d = `M${cx + r},${cy} A${r},${r} 0 ${largeArcFlag},${sweepFlag} ${ex},${ey}`;

			color = power < 0.0 ? this.props.reverseColor : this.props.forwardColor;
		}

		return (
			<g>
				<circle cx={cx} cy={cy} r={r} stroke={this.props.skeletonColor} fill="none"/>
				<path d={d} stroke={color} strokeWidth="3" fill="none"/>
			</g>
		);
	}
}

export default Thruster;
