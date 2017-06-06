# Navigation Module

## Setup Static IP Address

- Edit `/etc/dhcpcd.conf`
- Add the following to the end of the file;
```
interface eth0
static ip_address=192.168.0.1/24
```
- reboot
	- `sudo reboot`
- check ip address. It should match the static address in the .conf file
	- `ifconfig eth0`

## Setup uv4l

- `curl http://www.linux-projects.org/listing/uv4l_repo/lrkey.asc | sudo apt-key add -`
- Add `deb http://www.linux-projects.org/listing/uv4l_repo/raspbian/ jessie main` to `/etc/apt/sources.list`
- `sudo apt-get update`
- `sudo apt-get install uv4l uv4l-raspicam uv4l-server uv4l-raspicam-extras`
- Update`/etc/uv4l/uv4l-raspicam.conf`
	- Uncomment and set
		- encoding = mjpeg
		- width = 1296
		- height = 976
		- framerate = 24
		- quality = 10
		- nopreview = yes
	- Restart the service with `sudo service u4vl_raspicam restart`

## Miscellaneous

- `sudo pip3 install adafruit-pca9685`
- `sudo apt-get install vim`
- `sudo apt-get install netatalk`
- `sudo pip3 pymongo`
- `sudo apt-get install i2c-tools`
- setup .ssh directory on Raspberry Pi
```
cd ~
install -d -m 700 ~/.ssh
```
- Send ssh key to Pi from client machine
```
cat ~/.ssh/id_rsa.pub | ssh <USERNAME>@<IP-ADDRESS> 'cat >> .ssh/authorized_keys'
```

## I2C Addresses

### Sense Hat

- [Python Library Source](https://github.com/RPi-Distro/python-sense-hat)
- [RTIMULib Source](https://github.com/RPi-Distro/RTIMULib)

| id      | Chip     | Role |
| ------- | ----     | ---- |
| 1C      | LSM9DS1  | IMU - Magnetometer            |
| 46 (UU) | LED2472G | LEDs                          |
| 5C      | LPS25H   | Pressure/Temperature Sensor   |
| 5F      | HTS221   | Humidity/Temperature Sensor   |
| 6A      | LSM9DS1  | IMU - Accelerometer/Gyroscope |
