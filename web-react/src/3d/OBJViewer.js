import m4 from './m4';


let vertexShaderSource = `
attribute vec4 a_position;
attribute vec4 a_color;
attribute vec4 a_normal;

uniform mat4 u_matrix;
uniform mat4 u_NormalMatrix;

varying vec4 v_color;

void main() {
	gl_Position = u_matrix * a_position;

	vec3 ambientLight = vec3(0.15, 0.15, 0.15);
	vec3 lightDirection = vec3(-0.35, 0.35, 0.87);
	vec3 normal = normalize(vec3(u_NormalMatrix * a_normal));
	float nDotL = max(dot(normal, lightDirection), 0.0);

	v_color = vec4(ambientLight + a_color.rgb * nDotL, a_color.a);
}
`

let fragmentShaderSource = `
precision mediump float;

varying vec4 v_color;

void main() {
	// gl_FragColor = vec4(0.973, 0.878, 0.396, 1);
	gl_FragColor = v_color;
}
`

class OBJViewer {
	constructor(canvas, mesh) {
		this.gl = canvas.getContext('webgl');

		if (!this.gl) {
			console.log("Could not load WebGL context...exiting.");
			return;
		}

		this.gl.enable(this.gl.DEPTH_TEST);

		this.program = this.createProgram();
		this.attributes = this.getAttributes();
		this.uniforms = this.getUniforms();
		this.buffers = this.createBuffers(mesh);
		this.viewMatrix = this.getViewMatrix();
	}

	createProgram() {
		let gl = this.gl;
		let program = gl.createProgram();
		let vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderSource);
		let fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		var success = gl.getProgramParameter(program, gl.LINK_STATUS);

		if (success) {
			return program;
		}

		console.log(gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
	}

	createShader(type, source) {
		let gl = this.gl;
		let shader = gl.createShader(type);

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

		if (success) {
			return shader;
		}
		
		console.log(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
	}

	getAttributes() {
		// TODO: pass in list of attributes
		let gl = this.gl;

		return {
			a_position: gl.getAttribLocation(this.program, "a_position"),
			a_normal: gl.getAttribLocation(this.program, "a_normal"),
			a_color: gl.getAttribLocation(this.program, "a_color")
		};
	}

	getUniforms() {
		// TODO: pass in list of uniforms
		let gl = this.gl;

		return {
			u_matrix: gl.getUniformLocation(this.program, "u_matrix"),
			u_NormalMatrix: gl.getUniformLocation(this.program, "u_NormalMatrix")
		};
	}

	createBuffers(mesh) {
		let drawInfo = this.getDrawInfo(mesh);
		let gl = this.gl;
		let attributes = this.attributes;

		var buffers = {
			vertices: this.makeBuffer(attributes.a_position, drawInfo.vertices),
			normals: this.makeBuffer(attributes.a_normal, drawInfo.normals),
			colors: this.makeBuffer(attributes.a_color, drawInfo.colors),
			count: drawInfo.count
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		return buffers;
	}

	getDrawInfo(mesh) {
		var vertices = [];
		var normals = [];
		var colors = [];

		mesh.objects.forEach((object) => {
			var material = mesh.materials[object.material];
			var color = material.Kd;
			
			object.faces.forEach((face) => {
				face.forEach((position) => {
					vertices = vertices.concat(position.vertex);
					normals = normals.concat(position.normal);
					colors = colors.concat(color);
				})
			});
		});

		return {
			vertices: new Float32Array(vertices),
			normals: new Float32Array(normals),
			colors: new Float32Array(colors),
			count: vertices.length / 3
		};
	}

	makeBuffer(attr, data) {
		let gl = this.gl;
		let buffer = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
		gl.vertexAttribPointer(attr, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(attr);

		return buffer;
	}

	getViewMatrix() {
		let gl = this.gl;
		let lookAt = m4.lookAt([0, 0, -50], [0, 0, 0], [0, 1, 0]);
		let matrix = m4.perspective(
			Math.PI / 12,
			gl.canvas.clientWidth / gl.canvas.clientHeight,
			-100,
			10
		);
		
		return m4.multiply(matrix, lookAt);
	}

	render(angle) {
		let gl = this.gl;
		let uniforms = this.uniforms;

		this.resize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.useProgram(this.program);

		var modelMatrix = m4.rotateX(Math.sin(angle) * Math.PI / 12);
		modelMatrix = m4.multiply(modelMatrix, m4.rotateZ(Math.cos(angle) * Math.PI / 12))
		
		var normalMatrix = m4.inverse(modelMatrix);
		normalMatrix = m4.transpose(normalMatrix);

		gl.uniformMatrix4fv(uniforms.u_NormalMatrix, false, normalMatrix);

		var mvpMatrix = m4.multiply(this.viewMatrix, modelMatrix);

		gl.uniformMatrix4fv(uniforms.u_matrix, false, mvpMatrix);

		gl.drawArrays(gl.TRIANGLES, 0, this.buffers.count);
	}

	resize(canvas) {
		// Lookup the size the browser is displaying the canvas.
		var displayWidth  = canvas.clientWidth;
		var displayHeight = canvas.clientHeight;
		
		// Check if the canvas is not the same size.
		if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
			// Make the canvas the same size
			canvas.width  = displayWidth;
			canvas.height = displayHeight;
		}
	}
}

export default OBJViewer;
