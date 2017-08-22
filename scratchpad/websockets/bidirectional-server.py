#!/usr/bin/env python3

import asyncio
import websockets


async def consumer():
    pass


async def producer():
    pass


async def consumer_handler(websocket):
    while True:
        message = await websocket.recv()
        await consumer(message)


async def producer_handler(websocket):
    while True:
        message = await producer()
        await websocket.send(message)


async def handler(websocket, path):
    consumer_task = asyncio.ensure_future(consumer_handler(websocket))
    producer_task = asyncio.ensure_future(producer_handler(websocket))
    done, pending = await asyncio.wait(
        [consumer_task, producer_task],
        return_when=asyncio.FIRST_COMPLETED,
    )

    for task in pending:
        task.cancel()

handler()
