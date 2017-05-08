#!/usr/bin/env python3

import socket
import atexit
import pygame
from message import Message


PRECISION = 3

host = "192.168.0.1"
port = 9999

# create a socket object and connect to specified host/port
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((host, port))
print("Connected to server")


def close_socket():
    s.close()


def send_message(controller, type, index, value):
    m = Message()
    m.controller_index = controller
    m.input_type = type
    m.input_index = index
    m.input_value = value

    s.send(bytes(m))

    response = s.recv(1024)
    decoded_response = response.decode('ascii')
    if decoded_response != "OK":
        print(decoded_response)


atexit.register(close_socket)

pygame.init()
pygame.joystick.init()
stick = pygame.joystick.Joystick(0)
stick.init()

done = False
controller = 0
type = 0

while done is False:
    for event in pygame.event.get():
        value = None

        if event.type == pygame.QUIT:
            done = True
        elif event.type == pygame.JOYAXISMOTION:
            index = event.axis
            value = round(event.value, PRECISION)

        if value is not None:
            send_message(controller, type, index, value)
