import React, { Component } from 'react';
import './App.css';
import Clock from './components/Clock';
import LineChart from './components/LineChart';
import Compass from './components/Compass';
import Viewer3D from './components/Viewer3D';
import Thrusters from './components/Thrusters';

function generateData(frequency, trigFunction) {
    var t = Date.now();
    var data = [];

    for (var i = 0; i <= 60000; i += 1000) {
        var x = (i / 60000) * 100;

        var currentMillis = t + i;
        var currentSeconds = currentMillis / 1000;
        var angle = 2.0 * Math.PI * frequency * currentSeconds;
        var value = trigFunction(angle) * 20 + 45;

        value = Math.round(1000 * value) / 1000;

        data.push([x, value]);
    }

    return data;
}

function squareWave(angle) {
    let count = 5;
    var sum = 0.0;

    for (var i = 0; i < count; i++) {
        let overtone = i * 2 + 1;

        sum += Math.sin(angle * overtone) / overtone;
    }

    return sum;
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            depth: [],
            temperature: [],
            voltage: [],
            compass: [],
            thrusters: [[], [], [], [], []]
        };
    }

    componentDidMount() {
        this.intervalId = setInterval(
            () => this.tick(),
            1000
        );
        this.tick();
    }

    componentWillUnount() {
        clearInterval(this.intervalId);
    }

    tick() {
        let date = Date.now();

        this.setState({
            depth: generateData(0.025, Math.sin),
            temperature: generateData(0.05, Math.cos),
            voltage: generateData(0.025, squareWave),
            compass: (10 * date / 1000) % 360.0,
            thrusters: [
                Math.sin(0.025 * 2.0 * Math.PI * date / 1000).toFixed(3),
                Math.cos(0.05 * 2.0 * Math.PI * date / 1000).toFixed(3),
                squareWave(0.025 * 2.0 * Math.PI * date / 1000).toFixed(3),
                Math.cos(0.05 * 2.0 * Math.PI * date / 1000).toFixed(3),
                Math.sin(0.025 * 2.0 * Math.PI * date / 1000).toFixed(3)
            ]
        });
    }

    render() {
        var depth = this.state.depth;
        var temperature = this.state.temperature;
        var voltage = this.state.voltage;
        var direction = this.state.compass;
        var thrusters = this.state.thrusters;

        var depthLabel = depth.length > 0
            ? depth[depth.length - 1][1] + " ft"
            : "-- ft";
        var temperatureLabel = temperature.length > 0
            ? temperature[temperature.length - 1][1] + " °F"
            : "-- °F";
        var voltageLabel = voltage.length > 0
            ? voltage[voltage.length - 1][1] + " V"
            : " -- V";

        return (
            <div className="container">
                <div className="left">
                    <Clock/>
                    <LineChart label={depthLabel} data={depth}/>
                    <LineChart label={temperatureLabel} data={temperature}/>
                    <LineChart label={voltageLabel} data={voltage}/>
                </div>
                <div className="video">
                    <img alt="" src="http://192.168.0.1:8080/stream/video.mjpeg" width="1296" height="976"/>
                </div>
                <div className="right">
                    <Compass direction={direction}/>
                    <Viewer3D />
                    <Thrusters data={thrusters}/>
                </div>
            </div>
        );
    }
}

export default App;
