#!/usr/bin/env python3

import sys
import socket
import time
from input_types import MOTOR, AXIS, BUTTON
from message import Message
from utils import lerp


JL_H = 0  # left joystick horizontal axis
JL_V = 1  # left joystick vertical axis
JR_H = 2  # right joystick horizontal axis
JR_V = 3  # right joystick vertical axis

HOST = "192.168.0.1"
PORT = 9999

TICK = 1.0 / 60.0

controller = 0

# process command line args
for i in range(1, len(sys.argv)):
    arg = sys.argv[i]

    if arg == "-h" or arg == "--host":
        HOST = sys.argv[i + 1]


def send_message(controller, type, index, value):
    m = Message()

    m.controller_index = controller
    m.input_type = type
    m.input_index = index
    m.input_value = value

    if type == AXIS:
        print("Setting axis {} to {}".format(index, value))
    elif type == BUTTON:
        print("Setting button {} to {}".format(index, value))

    s.send(bytes(m))

    response = s.recv(1024)
    decoded_response = response.decode('ascii')

    if decoded_response != "OK":
        print(decoded_response)


def hold(seconds):
    time.sleep(seconds)


def ramp(type, index, fromValue, toValue, duration):
    start = time.time()
    end = start + duration
    current = start

    while current <= end:
        s = (current - start) / duration
        t = max(0.0, min(s, 1.0))
        value = lerp(fromValue, toValue, t)
        send_message(controller, type, index, value)
        time.sleep(TICK)
        current = time.time()

    # make sure we end up exactly at our toValue
    send_message(controller, type, index, toValue)


s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))
print("Connected to server")

# for i in range(0, 4):
#     for MAX_POWER in (0.5, 0.9):
#         ramp(AXIS, JL_V, 0.0, MAX_POWER, 1)
#         hold(30)
#         ramp(AXIS, JL_V, MAX_POWER, -MAX_POWER, 2)
#         hold(30)
#         ramp(AXIS, JL_V, -MAX_POWER, 0.0, 1)

#         ramp(AXIS, JR_V, 0.0, MAX_POWER, 1)
#         hold(30)
#         ramp(AXIS, JR_V, MAX_POWER, -MAX_POWER, 2)
#         hold(30)
#         ramp(AXIS, JR_V, MAX_POWER, 0.0, 1)

ramp(AXIS, JL_V, 0.0, 0.0, 1)
ramp(AXIS, JR_V, 0.0, 0.0, 1)

# ramp(AXIS, JL_H, 0.0, 0.5, 1)
# hold(1)
# ramp(AXIS, JL_H, 0.5, 0.5, 2)
# hold(1)


# ramp(AXIS, JL_H, 0.0, 0.0, 2)
# ramp(AXIS, JR_V, 0.0, 0.0, 2)

# set 50% forward directly
# send_message(controller, AXIS, JL_V, 0.5)
# hold(1)
# send_message(controller, AXIS, JL_V, 0.0)

# move motors forward, then backward
# NOTE: range is half-open, for example [0, 5)
# for i in range(0, 5):
#     duration = 0.25
#     max_speed = 0.5
#     ramp(MOTOR, i, 0.0, max_speed, duration)
#     hold(0.5)
#     ramp(MOTOR, i, max_speed, 0.0, duration)
#     hold(0.5)
#     ramp(MOTOR, i, 0.0, -max_speed, duration)
#     hold(0.5)
#     ramp(MOTOR, i, -max_speed, 0.0, duration)
#     hold(0.5)

s.close()
