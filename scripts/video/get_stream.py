#!/usr/bin/env python3
import requests

frames = []
data = b""
found_first = False
response = requests.get("http://navigation.local:8080/stream/video.h264", stream=True)

for chunk in response.iter_content(chunk_size=1024):
    if chunk:
        starting_offset = len(data)

        if starting_offset >= 2:
            if data[-1] == b"\x00":
                print("last byte is zero, backing up one")
                starting_offset -= 1
            if data[-2] == b"\x00":
                print("second to last byte is zero, backing up one more")
                starting_offset -= 1

        data = data + chunk
        offset = data.find(b"\x00\x00\x01", starting_offset)

        if offset != -1:
            print("found frame")
            remaining = data[offset:]

            if not found_first:
                print("dropping partial first frame")
                found_first = True
            else:
                print("adding frame", len(frames) + 1)
                frames.append(data[:offset])
                
                if len(frames) == 120:
                    break

            data = remaining

with open("navigation.h264", "wb") as out:
    out.write(b"\x00")
    for frame in frames:
        out.write(frame)
