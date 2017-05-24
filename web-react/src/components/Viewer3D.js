import React from 'react';
import submarine from '../3d/submarine';
import OBJViewer from '../3d/OBJViewer';

let ANGLE_STEP = 2.0 * Math.PI / 5;

class Viewer3D extends React.Component {
	componentDidMount() {
		this.viewer = new OBJViewer(this.refs.canvas, submarine);
		this.angle = 0.0;
		this.last = Date.now();
		this.tick = this.tick.bind(this);

		this.tick();
	}

	componentWillUnount() {
	}

	tick() {
		var now = Date.now();
		var elapsed = now - this.last;

		this.last = now;

		this.angle += (ANGLE_STEP * elapsed) / 1000.0;
		this.angle %= 2.0 * Math.PI;

		this.viewer.render(this.angle);

		requestAnimationFrame(this.tick, this.refs.canvas);
	}

	render() {
		return (
			<div className="submarine">
				<canvas ref="canvas" width="100" height="100">Canvas not supported</canvas>
			</div>
		)
	}
}

export default Viewer3D;
