#!/usr/bin/env python3

from sense_hat import SenseHat
from pymongo import MongoClient
from datetime import datetime


sense = SenseHat()
client = MongoClient("mongodb://10.0.1.25:27017")
db = client.g2x

last_time = datetime.utcnow()
sample_count = 0

while True:
    current_time = datetime.utcnow()
    elapsed_time = current_time - last_time

    orientation = sense.get_orientation()
    gyroscope = sense.get_gyroscope_raw()
    acceleration = sense.get_accelerometer_raw()
    compass = sense.get_compass()
    temperature_from_humidity = sense.get_temperature()
    temperature_from_pressure = sense.get_temperature_from_pressure()

    sample_count += 1

    if elapsed_time.seconds >= 1:
        print("samples per second =", sample_count)
        print("orientation =", orientation)
        print("gyroscope =", gyroscope)
        print("acceleration =", acceleration)
        print("compass =", compass)
        print("temperature_from_humidity =", temperature_from_humidity)
        print("temperature_from_pressure =", temperature_from_pressure)

        last_time = current_time
        sample_count = 0

        db.orientation.insert_one({
            "pitch": orientation["pitch"],
            "roll": orientation["roll"],
            "yaw": orientation["yaw"]
        })
        db.gyroscope.insert_one({
            "x": gyroscope["x"],
            "y": gyroscope["y"],
            "z": gyroscope["z"]
        })
        db.accelerometer.insert_one({
            "x": acceleration["x"],
            "y": acceleration["y"],
            "z": acceleration["z"]
        })
        db.compass.insert_one({
            "angle": compass
        })
        db.temperature.insert_one({
            "from_humidity": temperature_from_humidity,
            "from_pressure": temperature_from_pressure
        })
