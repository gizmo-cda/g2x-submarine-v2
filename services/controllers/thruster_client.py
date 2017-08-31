#!/usr/bin/env python3

import sys
import socket
import atexit
import pygame
from input_types import AXIS, BUTTON
from message import Message
import platform


# Each game controller axis returns a value in the closed interval [-1, 1]. We
# limit the number of decimal places we use with the PRECISION constant. This is
# done for a few reasons: 1) it makes the numbers more human-friendly (easier to
# read) and 2) it reduces the number of thruster updates.
#
# To elaborate on this last point, I was seeing a lot of very small fluctations
# with the values coming from my PS4 controller. The change in values were so
# small, they effectively would not change the current thruster value. By
# reducing the precision, these very small fluctuations get filtered out,
# resulting in fewer thruster updates. Also, I found that when I let go of a
# joystick, the value would hover around 0.0 but would never actually become
# zero. This means the thrusters would always be active, consuming battery power
# unnecessarily. Again, by limiting the precision, these small fluctuations were
# filtered out resulting in consistent zero values when then joysticks were in
# their resting positions.
#
# Using three digits of precisions was an arbitrary choice that just happened to
# work the first time. If we find that we need more fine control of the
# thrusters, we may need to increase this value.
PRECISION = 3

# NOTE: For some reason the same controller does not return the same axes
# numbers on macOS and Raspian, so we adjust these constants per OS so that the
# server will get consistent axis numbers. This has only been tested on macOS
# and Raspian
AXIS_MAP = None

if platform.system() == "Linux":
    AXIS_MAP = [0, 1, 2, 4, 5, 3]
elif platform.system() == "Windows":
    AXIS_MAP = [0, 1, 2, 3, 5, 4]
# NOTE that Darwin comes in, in the expected order

# This is the IP address and port of the server we will connect to. We send
# controller values to that machine over the network.
host = "192.168.0.1"
port = 9999

# process command line args
for i in range(1, len(sys.argv)):
    arg = sys.argv[i]

    if arg == "-h" or arg == "--host":
        host = sys.argv[i + 1]

# create a socket object and connect to specified host/port
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((host, port))
print("Connected to server")


def close_socket():
    '''
    This function is called when the script shuts down. We need to make sure
    that we cleanly close all sockets we opened in this script. Simply close
    the socket to free any system level resources we are using.
    '''
    s.close()


def send_message(controller, type, index, value):
    '''
    Send a message to the server

    controller indicates which controller this message comes from
    type indicates what kind of input we got from the controller
    index indicates which input of the given type is sending the message
    value indicates the value of the input
    '''

    # Create an instance of a helper class that will pack and unpack our message
    # data for us.
    m = Message()

    # set all of the values on our helper class
    m.controller_index = controller
    m.input_type = type
    m.input_index = index
    m.input_value = value

    # convert the message to a byte array and send it to the server
    s.send(bytes(m))

    # We wait for a response from the server to acknowledge it was received.
    # Note that in order to make this code more robust, we should use some sort
    # of timeout here so our code does not hang upon failure to receive a
    # response
    response = s.recv(1024)

    # We expect a plaintext reponse, so convert the response to ASCII
    decoded_response = response.decode('ascii')

    # if the response is 'OK', then all is good. Note that we are not handling
    # non 'OK' responses. This code needs to be improved for better error
    # handling. For now we just print 'OK' to give some feedback to us humans
    # that communication appears to be working.
    if decoded_response != "OK":
        print(decoded_response)


# make sure to close our socket when the script exits
atexit.register(close_socket)

# We're using PyGame in order to get data from the PS4 controller. Here we
# initialize the game engine and the joystick handling code. We grab a
# reference to the first controller and initialize it for reading.
pygame.init()
pygame.joystick.init()
stick = pygame.joystick.Joystick(0)
stick.init()

# The following flag is used to exit our infinite control reading loop.
done = False

# For now, we assume we have only one controller. We hard code this constant to
# make it clear which controller is sending data the server. It's much easier
# to understand what "controller" refers to in later code as opposed to the
# magic number 0. This number must be a value in the closed interval [0,3].
controller = 0

# There are different types of input that can be generated from a controller:
# axis data, buttons, etc. We only care about joystick data (axis data) for the
# moment and we represent that as type zero. However, it is likely that we'll
# want to use buttons as inputs as well. The type value will need to change to
# indicate that we are sending a button value versus an axis value. Ideally, we
# should have a set of constants (an enumeration) of the values we can use here.
# This number must be a value in the closed interval [0,3].
type = 0

# Process controller input until we're told to quit
while done is False:
    # Wait until we get some input from a controller
    for event in pygame.event.get():
        value = None

        if event.type == pygame.QUIT:
            # We've been told to quit, so set our done flag to true. This will
            # cause our infitinite loop to exit
            done = True
        elif event.type == pygame.JOYAXISMOTION:
            # We have a joystick event. Grab which axis this is and the axis'
            # current value
            type = AXIS
            if AXIS_MAP is not None and 0 <= event.axis and event.axis < len(AXIS_MAP):
                index = AXIS_MAP[event.axis]
            else:
                index = event.axis
            value = round(event.value, PRECISION)
        elif event.type == pygame.JOYBUTTONDOWN:
            type = BUTTON
            index = event.button
            value = 1
        elif event.type == pygame.JOYBUTTONUP:
            type = BUTTON
            index = event.button
            value = 0

        # if we got a new value, then send it to the server
        if value is not None:
            send_message(controller, type, index, value)
