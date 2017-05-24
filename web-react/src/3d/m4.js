import v3 from './v3';

var m4 = {
  multiply: (a, b) => {
    var a00 = a[ 0], a01 = a[ 1], a02 = a[ 2], a03 = a[ 3];
    var a10 = a[ 4], a11 = a[ 5], a12 = a[ 6], a13 = a[ 7];
    var a20 = a[ 8], a21 = a[ 9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    var b00 = b[ 0], b01 = b[ 1], b02 = b[ 2], b03 = b[ 3];
    var b10 = b[ 4], b11 = b[ 5], b12 = b[ 6], b13 = b[ 7];
    var b20 = b[ 8], b21 = b[ 9], b22 = b[10], b23 = b[11];
    var b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];

    return new Float32Array([
      a00*b00 + a10*b01 + a20*b02 + a30*b03,
      a01*b00 + a11*b01 + a21*b02 + a31*b03,
      a02*b00 + a12*b01 + a22*b02 + a32*b03,
      a03*b00 + a13*b01 + a23*b02 + a33*b03,

      a00*b10 + a10*b11 + a20*b12 + a30*b13,
      a01*b10 + a11*b11 + a21*b12 + a31*b13,
      a02*b10 + a12*b11 + a22*b12 + a32*b13,
      a03*b10 + a13*b11 + a23*b12 + a33*b13,

      a00*b20 + a10*b21 + a20*b22 + a30*b23,
      a01*b20 + a11*b21 + a21*b22 + a31*b23,
      a02*b20 + a12*b21 + a22*b22 + a32*b23,
      a03*b20 + a13*b21 + a23*b22 + a33*b23,

      a00*b30 + a10*b31 + a20*b32 + a30*b33,
      a01*b30 + a11*b31 + a21*b32 + a31*b33,
      a02*b30 + a12*b31 + a22*b32 + a32*b33,
      a03*b30 + a13*b31 + a23*b32 + a33*b33
    ]);
  },

  identity: (dst) => {
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  },

  translate: (tx, ty, tz) => {
    return new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      tx, ty, tz, 1
    ]);
  },

  rotateX: (radians) => {
    var c = Math.cos(radians);
    var s = Math.sin(radians);

    return new Float32Array([
      1,  0, 0, 0,
      0,  c, s, 0,
      0, -s, c, 0,
      0,  0, 0, 1
    ]);
  },

  rotateY: (radians) => {
    var c = Math.cos(radians);
    var s = Math.sin(radians);

    return new Float32Array([
      c, 0, -s, 0,
      0, 1,  0, 0,
      s, 0,  c, 0,
      0, 0,  0, 1
    ]);
  },

  rotateZ: (radians) => {
    var c = Math.cos(radians);
    var s = Math.sin(radians);

    return new Float32Array([
      c, s, 0, 0,
     -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  },

  scale: (sx, sy, sz) => {
    return new Float32Array([
      sx,  0,  0, 0,
       0, sy,  0, 0,
       0,  0, sz, 0,
       0,  0,  0, 1
    ]);
  },

  transpose: (m) => {
    return new Float32Array([
      m[0], m[4], m[ 8], m[12],
      m[1], m[5], m[ 9], m[13],
      m[2], m[6], m[10], m[14],
      m[3], m[7], m[11], m[15]
    ]);
  },

  inverse: (m) => {
    var m00 = m[0 * 4 + 0];
    var m01 = m[0 * 4 + 1];
    var m02 = m[0 * 4 + 2];
    var m03 = m[0 * 4 + 3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var m30 = m[3 * 4 + 0];
    var m31 = m[3 * 4 + 1];
    var m32 = m[3 * 4 + 2];
    var m33 = m[3 * 4 + 3];
    var tmp_0  = m22 * m33;
    var tmp_1  = m32 * m23;
    var tmp_2  = m12 * m33;
    var tmp_3  = m32 * m13;
    var tmp_4  = m12 * m23;
    var tmp_5  = m22 * m13;
    var tmp_6  = m02 * m33;
    var tmp_7  = m32 * m03;
    var tmp_8  = m02 * m23;
    var tmp_9  = m22 * m03;
    var tmp_10 = m02 * m13;
    var tmp_11 = m12 * m03;
    var tmp_12 = m20 * m31;
    var tmp_13 = m30 * m21;
    var tmp_14 = m10 * m31;
    var tmp_15 = m30 * m11;
    var tmp_16 = m10 * m21;
    var tmp_17 = m20 * m11;
    var tmp_18 = m00 * m31;
    var tmp_19 = m30 * m01;
    var tmp_20 = m00 * m21;
    var tmp_21 = m20 * m01;
    var tmp_22 = m00 * m11;
    var tmp_23 = m10 * m01;

    var t0 = (tmp_0 * m11 + tmp_3 * m21 +  tmp_4 * m31) - (tmp_1 * m11 + tmp_2 * m21 +  tmp_5 * m31);
    var t1 = (tmp_1 * m01 + tmp_6 * m21 +  tmp_9 * m31) - (tmp_0 * m01 + tmp_7 * m21 +  tmp_8 * m31);
    var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    return new Float32Array([
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * (( tmp_1 * m10 +  tmp_2 * m20 +  tmp_5 * m30) - ( tmp_0 * m10 +  tmp_3 * m20 +  tmp_4 * m30)),
      d * (( tmp_0 * m00 +  tmp_7 * m20 +  tmp_8 * m30) - ( tmp_1 * m00 +  tmp_6 * m20 +  tmp_9 * m30)),
      d * (( tmp_3 * m00 +  tmp_6 * m10 + tmp_11 * m30) - ( tmp_2 * m00 +  tmp_7 * m10 + tmp_10 * m30)),
      d * (( tmp_4 * m00 +  tmp_9 * m10 + tmp_10 * m20) - ( tmp_5 * m00 +  tmp_8 * m10 + tmp_11 * m20)),
      d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
    ]);
  },

  projection: (width, height, depth) => {
    return new Float32Array([
       2 / width,  0,           0,         0,
       0,         -2 / height,  0,         0,
       0,          0,           2 / depth, 0,
      -1,          1,           0,         1
    ]);
  },

  orthographic: (left, right, bottom, top, near, far) => {
    return new Float32Array([
      2 / (right - left), 0,                  0,                0,
      0,                  2 / (top - bottom), 0,                0,
      0,                  0,                  2 / (near - far), 0,
 
      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1
    ]);
  },

  perspective: (fov, aspect, near, far) => {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
    var rangeInv = 1.0 / (near - far);
 
    return new Float32Array([
      f / aspect, 0, 0,                         0,
      0,          f, 0,                         0,
      0,          0, (near + far) * rangeInv,  -1,
      0,          0, near * far * rangeInv * 2, 0
    ]);
  },

  lookAt: (cameraPosition, target, up) => {
    var z = v3.normalize(v3.subtract(cameraPosition, target));
    var x = v3.normalize(v3.cross(up, z));
    var y = v3.normalize(v3.cross(z, x));

    return new Float32Array([
      x[0],              x[1],              x[2],              0,
      y[0],              y[1],              y[2],              0,
      z[0],              z[1],              z[2],              0,
      cameraPosition[0], cameraPosition[1], cameraPosition[2], 1
    ]);
  }
};

export default m4;
