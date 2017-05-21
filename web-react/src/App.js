import React, { Component } from 'react';
import './App.css';
import LineChart from './components/LineChart';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        this.intervalId = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnount() {
        clearInterval(this.intervalId);
    }

    tick() {
        var t = Date.now();
        var data = [];

        for (var i = 10; i < 100; i += 10) {
            var value = ((i + t * 0.25) % 80) + 10;

            data.push([i, value]);
        }

        this.setState({ data: data });
    }

    render() {
        var data = this.state.data;

        return (
            <div className="App">
                <LineChart label="-- ft" data={data}/>
                <LineChart label="-- °F" data={data}/>
            </div>
        );
    }
}

export default App;
