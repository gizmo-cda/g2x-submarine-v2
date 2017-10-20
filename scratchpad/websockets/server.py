#!/usr/bin/env python3

import asyncio
import websockets
from message import Message


async def time(websocket, path):
    while True:
        data = await websocket.recv()

        if len(data) == 0:
            print("disconnecting client")
            break

        m = Message(data)
        print("C: {}, T: {}, I: {}, V: {}".format(
            m.controller_index, m.input_type, m.input_index, m.input_value
        ))

        await websocket.send("OK")

start_server = websockets.serve(time, '127.0.0.1', 9997)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
