import React, { Component } from 'react';
import './App.css';
import LineChart from './components/LineChart';
import data from './data';

class App extends Component {
  render() {
    return (
      <div className="App">
        <LineChart data={data}/>
      </div>
    );
  }
}

export default App;
