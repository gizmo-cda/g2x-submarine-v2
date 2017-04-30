#!/usr/bin/env python3

from sense_hat import SenseHat
from pymongo import MongoClient
import time


DELAY = 1   # in seconds

sense = SenseHat()
client = MongoClient("mongodb://192.168.0.128:27017")
db = client.g2x

while True:
    orientation = sense.get_orientation_degrees()
    print(orientation)
    acceleration = sense.get_accelerometer()
    compass = sense.get_compass()
    temperature_from_humidity = sense.get_temperature()
    temperature_from_pressure = sense.get_temperature_from_pressure()

    db.gyroscope.insert_one({
        "pitch": orientation["pitch"],
        "roll": orientation["roll"],
        "yaw": orientation["yaw"]
    })
    db.accelerometer.insert_one({
        "pitch": acceleration["pitch"],
        "roll": acceleration["roll"],
        "yaw": acceleration["yaw"]
    })
    db.compass.insert_one({"angle": compass})
    db.temperature.insert_one({
        "from_humidity": temperature_from_humidity,
        "from_pressure": temperature_from_pressure
    })

    time.sleep(DELAY)
