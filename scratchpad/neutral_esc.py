#!/usr/bin/env python3

from pwm_controller import PWMController

# Motor Constants
HL = 0
VL = 1
VC = 2
VR = 3
HR = 4

FULL_REVERSE = 246
NEUTRAL = 369
FULL_FORWARD = 496


def set_motors(value):
    for motor in range(0, 5):
        motor_controller.add_device("Motor {}".format(motor), motor, 0, value)


# setup motor controller
motor_controller = PWMController()

# initalize motors
print("Waiting for initialization")
set_motors(NEUTRAL)
print("done")
