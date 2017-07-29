class InterpolatorWithSensitivity {
    constructor(interpolator, sensitivity) {
        this.interpolator = interpolator;
        this.sensitivity = sensitivity;
    }

    valueAtIndex(index) {
        let power = this.interpolator.valueAtIndex(index);

        return this.sensitivity.valueAtIndex(power);
    }
}
