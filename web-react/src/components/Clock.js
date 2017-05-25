import React from 'react';
import Label from './Label';

let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
let dayNames = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];

class Clock extends React.Component {
	static defaultProps = {
		width: 100,
		height: 100,
		color: "rgb(255, 128, 0)",
		hand_color: "rgb(200, 200, 200)",
	};

	constructor(props) {
		super(props);

		this.state = { date: new Date() };
	}

	componentDidMount() {
		this.intervalId = setInterval(
			() => this.tick(),
			1000
		);
	}

	componentWillUnmount() {
		clearInterval(this.intervalId);
	}

	tick() {
		this.setState({
			date: new Date()
		});
	}

	render() {
		let padding     = 25,
			width       = this.props.width,
			height      = this.props.height,
			half_width  = width * 0.5,
			half_height = height * 0.5,
			origin      = `translate(${half_width}, ${half_height})`,
			radius      = (Math.min(width, height) - padding) * 0.5 - 1,
			color       = this.props.color,
			hand_color  = this.props.hand_color;

		let date = this.state.date;

		let dayName = dayNames[date.getDay()];
		let monthName = monthNames[date.getMonth()];
		let dateString = `${monthName} ${date.getDate()}, ${date.getFullYear()}`;

		let hour = date.getHours() % 12;
		let minutes = date.getMinutes();
		let seconds = date.getSeconds();

		let hourAngle = (360 * ((hour + (minutes / 60)) / 12)) - 90;
		let hourAngleString = `rotate(${hourAngle})`;
		let minuteAngle = (360 * (minutes + (seconds / 60)) / 60) - 90;
		let minuteAngleString = `rotate(${minuteAngle})`;
		let secondAngle = (360 * seconds / 60) - 90;
		let secondAngleString = `rotate(${secondAngle})`;

		return (
			<svg className="clock" width={width} height={height}>
				<Label x={half_width} y={10} alignment="middle">{dayName}</Label>
				<Label x={half_width} y={height} alignment="middle">{dateString}</Label>
				<g transform={origin}>
                    <circle r={radius} stroke={color} strokeWidth={1} fill="none"/>
                    <line x1={radius - 9} x2={radius} stroke={color} transform="rotate(0)"/>
                    <line x1={radius - 5} x2={radius} stroke={color} transform="rotate(30)"/>
                    <line x1={radius - 5} x2={radius} stroke={color} transform="rotate(60)"/>
                    <line x1={radius - 9} x2={radius} stroke={color} transform="rotate(90)"/>
                    <line x1={radius - 5} x2={radius} stroke={color} transform="rotate(120)"/>
                    <line x1={radius - 5} x2={radius} stroke={color} transform="rotate(150)"/>
                    <line x1={radius - 9} x2={radius} stroke={color} transform="rotate(180)"/>
                    <line x1={radius - 5} x2={radius} stroke={color} transform="rotate(210)"/>
                    <line x1={radius - 5} x2={radius} stroke={color} transform="rotate(240)"/>
                    <line x1={radius - 9} x2={radius} stroke={color} transform="rotate(270)"/>
                    <line x1={radius - 5} x2={radius} stroke={color} transform="rotate(300)"/>
                    <line x1={radius - 5} x2={radius} stroke={color} transform="rotate(330)"/>
                    <g transform={hourAngleString}>
                    	<line x2={radius * 0.65} stroke={hand_color}/>
                    </g>
                    <g transform={minuteAngleString}>
                    	<line x2={radius - 3} stroke={hand_color}/>
                    </g>
                    <g transform={secondAngleString}>
                    	<line x2={radius - 3} stroke="red" />
                    </g>
                </g>
			</svg>
		)
	}
}

export default Clock;