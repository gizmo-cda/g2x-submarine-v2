from vector2d import Vector2D
from interpolator import Interpolator
from pwm_controller import PWMController
from utils import map_range


PRECISION = 3

# Motor Constants
HL = 0
VL = 1
VC = 2
VR = 3
HR = 4

FULL_REVERSE = 246
NEUTRAL = 369
FULL_FORWARD = 496


class ThrusterController:
    def __init__(self):
        # setup motor controller
        self.motor_controller = PWMController()
        self.motor_controller.add_device("HL", HL, 0, NEUTRAL)
        self.motor_controller.add_device("VL", VL, 0, NEUTRAL)
        self.motor_controller.add_device("VC", VC, 0, NEUTRAL)
        self.motor_controller.add_device("VR", VR, 0, NEUTRAL)
        self.motor_controller.add_device("HR", HR, 0, NEUTRAL)

        # setup left joystick
        self.j1 = Vector2D()

        self.left_thruster = Interpolator()
        self.left_thruster.addIndexValue(0.0, -1.0)
        self.left_thruster.addIndexValue(90.0, 1.0)
        self.left_thruster.addIndexValue(180.0, 1.0)
        self.left_thruster.addIndexValue(270.0, -1.0)
        self.left_thruster.addIndexValue(360.0, -1.0)

        self.right_thruster = Interpolator()
        self.right_thruster.addIndexValue(0.0, 1.0)
        self.right_thruster.addIndexValue(90.0, 1.0)
        self.right_thruster.addIndexValue(180.0, -1.0)
        self.right_thruster.addIndexValue(270.0, -1.0)
        self.right_thruster.addIndexValue(360.0, 1.0)

        # setup right joystick
        self.j2 = Vector2D()

        self.v_front_thruster = Interpolator()
        self.v_front_thruster.addIndexValue(0.0, 0.0)
        self.v_front_thruster.addIndexValue(90.0, -1.0)
        self.v_front_thruster.addIndexValue(180.0, 0.0)
        self.v_front_thruster.addIndexValue(270.0, 1.0)
        self.v_front_thruster.addIndexValue(360.0, 0.0)

        self.v_back_left_thruster = Interpolator()
        self.v_back_left_thruster.addIndexValue(0.0, 1.0)
        self.v_back_left_thruster.addIndexValue(90.0, 1.0)
        self.v_back_left_thruster.addIndexValue(180.0, -1.0)
        self.v_back_left_thruster.addIndexValue(270.0, -1.0)
        self.v_back_left_thruster.addIndexValue(360.0, 1.0)

        self.v_back_right_thruster = Interpolator()
        self.v_back_right_thruster.addIndexValue(0.0, -1.0)
        self.v_back_right_thruster.addIndexValue(90.0, 1.0)
        self.v_back_right_thruster.addIndexValue(180.0, 1.0)
        self.v_back_right_thruster.addIndexValue(270.0, -1.0)
        self.v_back_right_thruster.addIndexValue(360.0, -1.0)

        # setup ascent/descent controllers
        self.ascent = -1.0
        self.descent = -1.0

    def __del__(self):
        self.set_motor(HL, 0.0)
        self.set_motor(VL, 0.0)
        self.set_motor(VC, 0.0)
        self.set_motor(VL, 0.0)
        self.set_motor(HR, 0.0)

    def update_axis(self, axis, value):
        update_horizontal_thrusters = False
        update_vertical_thrusters = False
        value = round(value, PRECISION)

        if axis == 0:
            if self.j1.x != value:
                self.j1.x = value
                update_horizontal_thrusters = True
        elif axis == 1:
            if self.j1.y != value:
                self.j1.y = value
                update_horizontal_thrusters = True
        elif axis == 2:
            if self.j2.x != value:
                self.j2.x = value
                update_vertical_thrusters = True
        elif axis == 5:
            if self.j2.y != value:
                self.j2.y = value
                update_vertical_thrusters = True
        elif axis == 3:
            if self.descent != value:
                self.descent = value
                update_vertical_thrusters = True
        elif axis == 4:
            if self.ascent != value:
                self.ascent = value
                update_vertical_thrusters = True
        else:
            pass
            # print("unknown axis ", event.axis)

        if update_horizontal_thrusters:
            left_value = self.left_thruster.valueAtIndex(self.j1.angle)
            right_value = self.right_thruster.valueAtIndex(self.j1.angle)
            power = min(1.0, self.j1.length)
            self.set_motor(HL, left_value * power)
            self.set_motor(HR, right_value * power)

        if update_vertical_thrusters:
            power = min(1.0, self.j2.length)
            back_value = self.v_front_thruster.valueAtIndex(self.j2.angle) * power
            front_left_value = self.v_back_left_thruster.valueAtIndex(self.j2.angle) * power
            front_right_value = self.v_back_right_thruster.valueAtIndex(self.j2.angle) * power
            if self.ascent != -1.0:
                percent = (1.0 + self.ascent) / 2.0
                max_thrust = max(back_value, front_left_value, front_right_value)
                max_adjust = (1.0 - max_thrust) * percent
                back_value += max_adjust
                front_left_value += max_adjust
                front_right_value += max_adjust
            elif self.descent != -1.0:
                percent = (1.0 + self.descent) / 2.0
                min_thrust = min(back_value, front_left_value, front_right_value)
                max_adjust = (min_thrust - -1.0) * percent
                back_value -= max_adjust
                front_left_value -= max_adjust
                front_right_value -= max_adjust
            self.set_motor(VC, back_value)
            self.set_motor(VL, front_left_value)
            self.set_motor(VR, front_right_value)

    def set_motor(self, motor_number, value):
        motor = self.motor_controller.devices[motor_number]
        pwm_value = int(map_range(value, -1.0, 1.0, FULL_REVERSE, FULL_FORWARD))

        # print("setting motor {0} to {1}".format(motor_number, pwm_value))
        motor.off = pwm_value


if __name__ == "__main__":
    pass
