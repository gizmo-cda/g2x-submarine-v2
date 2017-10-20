
class GameControllerManager {
    constructor() {
        this.controllers = {};
        this.client = new ThrusterClient();

        window.addEventListener("gamepadconnected", this);
        window.addEventListener("gamepaddisconnected", this);
    }

    add(gamepad) {
        this.controllers[gamepad.index] = this.createGameController(gamepad);

        if (this.onadd !== null && this.onadd !== undefined) {
            this.onadd(this.controllers[gamepad.index]);
        }
    }

    remove(gamepad) {
        let controller = this.controllers[gamepad.index]

        delete this.controllers[gamepad.index];

        if (controller !== null && controller != undefined) {
            controller.onchange = null;

            if (this.onremove !== null && this.onremove !== undefined) {
                this.onremove(controller);
            }
        }

    }

    scan() {
        var gamepads = navigator.getGamepads();

        for (var i = 0; i < gamepads.length; i++) {
            var gamepad = gamepads[i];

            if (gamepad) {
                if (gamepad.index in this.controllers) {
                    this.remove(this.controllers[gamepad.index]);
                }

                this.add(gamepad);
            }
        }
    }

    update() {
        //this.scan();

        var gamepads = navigator.getGamepads();

        for (var i = 0; i < gamepads.length; i++) {
            var gamepad = gamepads[i];

            if (gamepad !== null) {
                var controller = this.controllers[gamepad.index];

                if (controller !== null && controller !== undefined) {
                    controller.update(gamepad);
                }
                else {
                    this.add(gamepad);
                }
            }
        }

        requestAnimationFrame(() => { this.update() });
    }

    createGameController(gamepad) {
        let result = new GameController(gamepad);

        result.onchange = (controller_index, type, index, value) => {
            if (type === BUTTON) {
                if (index === 6) {
                    index = 4;
                    type = AXIS;
                    value = value * 2.0 - 1.0;
                }
                else if (index === 7) {
                    index = 5;
                    type = AXIS;
                    value = value * 2.0 - 1.0;
                }
            }

            if (this.onchange !== null && this.onchange !== undefined) {
                this.onchange(result);
            }

            this.client.sendMessage(controller_index, type, index, value);
        }

        return result;
    }

    handleEvent(e) {
        this[e.type](e);
    }

    gamepadconnected(e) {
        console.log("controller connected: " + e.gamepad.id);
        this.add(e.gamepad);
    }

    gamepaddisconnected(e) {
        console.log("controller disconnected: " + e.gamepad.id);
        this.remove(e.gamepad);
    }
}
