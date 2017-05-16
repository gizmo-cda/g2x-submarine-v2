#!/usr/bin/env python3

import socket
import _thread
from message import Message
from thruster_controller import ThrusterController

HOST = "0.0.0.0"
PORT = 9999


def on_new_client(clientsocket, addr):
    controller = ThrusterController()

    while True:
        msg = clientsocket.recv(1024)

        if msg == b'':
            print("empty message, disconnecting client")
            break
        else:
            m = Message(msg)
            controller.update_axis(m.input_index, m.input_value)
            # print(str(m))

        clientsocket.send("OK".encode())

    clientsocket.close()


if __name__ == "__main__":
    s = socket.socket()
    s.bind((HOST, PORT))
    s.listen(5)

    print("Server bound to {}:{}".format(HOST, PORT))

    while True:
        c, addr = s.accept()
        print('Got connection from', addr)

        _thread.start_new_thread(on_new_client, (c, addr))

    s.close()
