function lerp(a, b, t) {
    return (1.0 - t) * a + t * b;
}

function map(value, inMin, inMax, outMin, outMax) {
    let inDelta = inMax - inMin;
    let outDelta = outMax - outMin;

    return (value - inMin) * outDelta / inDelta + outMin;
}
