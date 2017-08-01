def lerp(a, b, t):
    return (1.0 - t) * a + t * b


def map_range(x, in_min, in_max, out_min, out_max):
    out_delta = out_max - out_min
    in_delta = in_max - in_min

    return (x - in_min) * out_delta / in_delta + out_min
