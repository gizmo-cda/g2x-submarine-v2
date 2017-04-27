#!/usr/bin/env python3

from sense_hat import SenseHat
from pymongo import MongoClient

sense = SenseHat()
client = MongoClient("mongodb://192.168.0.128:27017")
db = client.g2x

for _ in range(0, 1000):
    reading = sense.get_compass()
    db.compass.insert_one({"angle": reading})
    # db.compass.insert_one({"angle": 359.0})
