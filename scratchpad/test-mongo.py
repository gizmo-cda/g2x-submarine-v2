#!/usr/bin/env python3

from pymongo import MongoClient


client = MongoClient("mongodb://127.0.0.1:27017")
db = client.g2x
result = db.values.insert_one({
    "property": "temperature",
    "value": 72.5
})

cursor = db.values.find()

for document in cursor:
    print(document)
