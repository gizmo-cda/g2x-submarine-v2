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
input("Press return once hear two beeps: ")

# full forward
print("Setting motors to full forward")
set_motors(FULL_FORWARD)
input("Press return once hear two beeps: ")

# full reverse
print("Setting motors to full reverse")
set_motors(FULL_REVERSE)
input("Press return once hear two beeps: ")

# neutral
set_motors(NEUTRAL)
print("Calibration complete")
