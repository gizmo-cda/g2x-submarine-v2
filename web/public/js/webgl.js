var canvas;
var gl;

function initGL() {
	canvas = document.getElementById('vessel');
	gl = canvas.getContext('webgl');

	if (!gl) {
		return;
	}

	var vertexShaderSource = document.getElementById("2d-vertex-shader").text;
	var fragmentShaderSource = document.getElementById("2d-fragment-shader").text;
	 
	var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

	var program = createProgram(gl, vertexShader, fragmentShader);

	var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

	var positionBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// three 2d points
	var positions = [
		0, 0,
		0, 0.5,
		0.7, 0,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	resize(canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(program);

	gl.enableVertexAttribArray(positionAttributeLocation);

	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	var size = 2;          // 2 components per iteration
	var type = gl.FLOAT;   // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0;        // start at the beginning of the buffer
	gl.vertexAttribPointer(
	    positionAttributeLocation, size, type, normalize, stride, offset)

	// draw
	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = 3;

	gl.drawArrays(primitiveType, offset, count);
}

function resize(canvas) {
	// Lookup the size the browser is displaying the canvas.
	var displayWidth  = canvas.clientWidth;
	var displayHeight = canvas.clientHeight;
	
	// Check if the canvas is not the same size.
	if (canvas.width != displayWidth || canvas.height != displayHeight) {
		// Make the canvas the same size
		canvas.width  = displayWidth;
		canvas.height = displayHeight;
	}
}

function createShader(gl, type, source) {
	var shader = gl.createShader(type);

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

	if (success) {
		return shader;
	}
	
	console.log(gl.getShaderInfoLog(shader));

	gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
	var program = gl.createProgram();

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
