#!/usr/bin/env python3

import pygame


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
            index = event.axis
            value = round(event.value, PRECISION)

        # if we got a new value, then send it to the server
        if value is not None:
            if value == -1 or value == 1:
                print("controller={}, type={}, index={}, value={}".format(controller, type, index, value))
