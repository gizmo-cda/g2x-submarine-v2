var v3 = {
    subtract: (a, b) => {
        return new Float32Array([
            a[0] - b[0],
            a[1] - b[1],
            a[2] - b[2]
        ]);
    },

    normalize: (v) => {
        var length = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);

        // allow divide by zero for now
        return new Float32Array([
            v[0] / length,
            v[1] / length,
            v[2] / length
        ]);
    },

    cross: (a, b) => {
        return new Float32Array([
            a[1]*b[2] - a[2]*b[1],
            a[2]*b[0] - a[0]*b[2],
            a[0]*b[1] - a[1]*b[0]
        ]);
    }
};

export default v3;
