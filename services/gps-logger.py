#!/usr/bin/env python3

# for command formats, see http://www.gpsinformation.org/dale/nmea.htm
import serial
from datetime import datetime, tzinfo, timedelta
from pymongo import MongoClient


class Zone(tzinfo):

    def __init__(self, offset, isdst, name):
        self.offset = offset
        self.isdst = isdst
        self.name = name

    def utcoffset(self, dt):
        return timedelta(hours=self.offset) + self.dst(dt)

    def dst(self, dt):
        return timedelta(hours=1) if self.isdst else timedelta(0)

    def tzname(self, dt):
        return self.name


def make_local_datetime(fix, date):
    hour = fix[0:2]
    minutes = fix[2:4]
    seconds = fix[4:6]
    day = date[0:2]
    month = date[2:4]
    year = "20" + date[4:6]
    datestring = "{}-{}-{}T{}:{}:{}-0000".format(year, month, day, hour, minutes, seconds)

    utc_time = datetime.strptime(datestring, "%Y-%m-%dT%H:%M:%S%z")
    utc_time_aware = utc_time.replace(tzinfo=GMT)
    local_time_aware = utc_time_aware.astimezone(PDT)
    # timestamp = local_time_aware.strftime("%s")
    # print(utc_time)
    # print(utc_time_aware)
    # print(local_time_aware)
    # print(timestamp)

    return local_time_aware


def parseGGA(line):
    '''
    $GPGGA,003907.000,4741.0757,N,11647.1921,W,2,08,1.10,670.1,M,-16.9,M,0000,0000*56

    GGA          Global Positioning System Fix Data
    003907.000   Fix taken at 12:35:19 UTC
    4741.0757,N  Latitude 48 deg 07.038' N
    11647.1921,W Longitude 11 deg 31.000' E
    2            Fix quality:   0 = invalid
                                1 = GPS fix (SPS)
                                2 = DGPS fix
                                3 = PPS fix
                                4 = Real Time Kinematic
                                5 = Float RTK
                                6 = estimated (dead reckoning) (2.3 feature)
                                7 = Manual input mode
                                8 = Simulation mode
    08           Number of satellites being tracked
    1.10         Horizontal dilution of position
    670.1,M      Altitude, Meters, above mean sea level
    -16.9,M      Height of geoid (mean sea level) above WGS84
                 ellipsoid
    0000         time in seconds since last DGPS update
    0000         DGPS station ID number
    *56          the checksum data, always begins with *
    '''
    (cmd, fix, lat, lat_compass, lng, lng_compass, fix_quality, sat_count, dilution, alt, alt_units, _, _, _, _) = line.split(",")

    feet = str(round(float(alt) * 3.28084, 3))

    db.gps.insert_one({
        "latitude": float(lat),
        "latitude_compass": lat_compass,
        "longitude": float(lng),
        "longitude_compass": lng_compass,
        "altitude": feet,
        "altitude_units": "ft",
        "fix_quality": int(fix_quality),
        "satellite_count": int(sat_count)
    })
    print(lat + lat_compass, lng + lng_compass, feet + "ft", int(fix_quality), int(sat_count))


def parseGSA(line):
    '''
    $GPGSA,A,3,19,24,17,02,29,12,05,25,06,,,,1.49,0.96,1.13*04

    GSA      Satellite status
    A        Auto selection of 2D or 3D fix (M = manual)
    3        3D fix - values include:   1 = no fix
                                        2 = 2D fix
                                        3 = 3D fix
    19,24... PRNs of satellites used for fix (space for 12)
    1.49     PDOP (dilution of precision)
    0.96     Horizontal dilution of precision (HDOP)
    1.13     Vertical dilution of precision (VDOP)
    *04      the checksum data, always begins with *
    '''
    pass


def parseRMC(line):
    '''
    $GPRMC,003758.000,A,4741.0717,N,11647.1868,W,0.26,151.76,080517,,,D*7E

    RMC          Recommended Minimum sentence C
    003758.000   Fix taken at 12:35:19 UTC
    A            Status A=active or V=Void.
    4741.0717,N  Latitude 48 deg 07.038' N
    11647.1868,W Longitude 11 deg 31.000' E
    0.26         Speed over the ground in knots
    151.76       Track angle in degrees True
    080517       Date - 8th of May 2017
    003.1,W      Magnetic Variation
    D            ?
    *7E          The checksum data, always begins with *
    '''
    (cmd, fix, status, lat, lat_compass, lng, lng_compass, knots, track_angle, date, mag, mag_compass, checksum) = line.split(",")

    local_time_aware = make_local_datetime(fix, date)

    db.gps.insert_one({
        "timestamp": local_time_aware,
        "latitude": lat,
        "latitude_compass": lat_compass,
        "longitude": lng,
        "longitude_compass": lng_compass,
        "track_angle": track_angle
    })
    print(local_time_aware, lat + lat_compass, lng + lng_compass, track_angle)


def parseVTG(line):
    '''
    $GPVTG,305.74,T,,M,0.03,N,0.05,K,D*3B

    VTG          Track made good and ground speed
    305.74,T     True track made good (degrees)
    ,M           Magnetic track made good
    0.03,N       Ground speed, knots
    0.05,K       Ground speed, Kilometers per hour
    D            ?
    *3B          Checksum
    '''
    pass


def parseGSV(line):
    '''
    $GPGSV,3,1,11,12,83,219,41,02,77,169,36,06,48,057,27,25,43,306,26*79
    $GPGSV,3,2,11,48,33,201,35,19,24,079,24,24,21,216,27,29,15,271,30*7A
    $GPGSV,3,3,11,05,13,158,33,17,07,084,23,31,06,333,18*40

    GSV          Satellites in view
    3            Number of sentences for full data
    1            sentence 1 of 3
    11           Number of satellites in view

    12           Satellite PRN number
    83           Elevation, degrees
    219          Azimuth, degrees
    41           SNR - higher is better
                 for up to 4 satellites per sentence
    *79          the checksum data, always begins with *
    '''
    pass


GMT = Zone(0, False, 'GMT')
PDT = Zone(-8, True, 'PDT')

handlers = {
    "GGA": parseGGA,
    "GSA": parseGSA,
    "RMC": parseRMC,
    "VTG": parseVTG,
    "GSV": parseGSV
}

client = MongoClient("mongodb://10.0.1.25:27017")
db = client.g2x

ser = serial.Serial()
ser.port = "/dev/ttyUSB0"
ser.baudrate = 9600

ser.open()

while True:
    line = ser.readline().decode("ascii").strip()

    if line[0:3] == "$GP":
        cmd = line[3:6]
        if cmd in handlers:
            handlers[cmd](line)
        else:
            print("Unrecognized command:", cmd)

ser.close()
