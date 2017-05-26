import React from 'react';
import Thruster from './Thruster';

class Thrusters extends React.Component {
	static defaultProps = {
		width: 100,
		height: 100,
		data: [0.0, 0.0, 0.0, 0.0, 0.0]
	};

	render() {
		let width  = this.props.width;
		let height = this.props.height;
		let thrusters = this.props.data;

		return (
			<svg className="thrusters" width={width} height={height}>
				<Thruster cx={14} cy={35} power={thrusters[0]}/>
				<Thruster cx={37} cy={28} power={thrusters[1]}/>
				<Thruster cx={50} cy={70} power={thrusters[2]}/>
				<Thruster cx={63} cy={28} power={thrusters[3]}/>
				<Thruster cx={87} cy={35} power={thrusters[4]}/>
			</svg>
		)
	}
}

export default Thrusters;
