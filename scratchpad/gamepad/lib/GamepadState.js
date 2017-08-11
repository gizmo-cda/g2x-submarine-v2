const MOTOR = 0;
const AXIS = 1;
const BUTTON = 2;

class GamepadState {
    constructor(gamepad) {
        this.index = gamepad.index;
        this.axes = [];
        this.buttons = [];
        this.onchange = null;

        this.update(gamepad);
    }

    update(gamepad) {
        this.index = gamepad.index;

        // loop through all axes
        gamepad.axes.forEach((axis, index) => {
            let newValue = axis.toFixed(3);

            if (this.axes[index] !== newValue) {
                this.axes[index] = newValue;
                this.fireOnChange(AXIS, index, newValue);
            }
        });

        // loop through all buttons
        gamepad.buttons.forEach((button, index) => {
            let newValue = button.value;

            if (this.buttons[index] !== newValue) {
                this.buttons[index] = newValue;
                this.fireOnChange(BUTTON, index, newValue);
            }
        });

        // TOOD: handle hat
    }

    fireOnChange(type, index, value) {
        if (this.onchange !== null && this.onchange !== undefined) {
            this.onchange(this.index, type, index, value);
        }
    }
}
