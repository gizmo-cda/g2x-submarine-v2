const MOTOR = 0;
const AXIS = 1;
const BUTTON = 2;

class GameController {
    constructor(gamepad) {
        this.id = gamepad.id;
        this.index = gamepad.index;
        this.axes = [];
        this.buttons = [];
        this.onchange = null;

        this.update(gamepad);
    }

    update(gamepad) {
        var i;

        this.index = gamepad.index;

        // check all axes
        for (i = 0; i < gamepad.axes.length; i++ ) {
            let axis = gamepad.axes[i];
            let newValue = axis.toFixed(3);

            if (this.axes[i] !== newValue) {
                // console.log(`axis[${i}]: ${this.axes[i]} != ${newValue}`);
                this.axes[i] = newValue;
                this.fireOnChange(AXIS, i, newValue);
            }
        };

        // check all buttons
        for (i = 0; i < gamepad.buttons.length; i++) {
            let button = gamepad.buttons[i];
            let newValue = button.value;

            if (this.buttons[i] !== newValue) {
                // console.log(`button[${i}]: ${this.buttons[i]} != ${newValue}`);
                this.buttons[i] = newValue;
                this.fireOnChange(BUTTON, i, newValue);
            }
        };
    }

    fireOnChange(type, index, value) {
        if (this.onchange !== null && this.onchange !== undefined) {
            // console.log(`firing T:${type}, I:${index}, V:${value}`)
            this.onchange(this.index, type, index, value);
        }
    }
}
