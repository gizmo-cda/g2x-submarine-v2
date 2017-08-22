# Mini-Sub Setup

# Install Raspbian
  - Download Raspian from [Raspberry Pi Foundation](https://www.raspberrypi.org/downloads/raspbian/)
    - Note that installation directions are available from that page for all major OSes. These directions assume you are using macOS
  - Insert SD card
  - Format as MS-DOS (FAT32)
  - Determine to which device your drive has been attached
    - This can be done via `Disk Utility` by selecting the drive in the UI and looking for the "Device" section on the right.
  - Unmount all mounted paritions
    - You can hover on each mounted partition in `Disk Utility` to reveal the `eject` icon. Click that icon on each partition.
  - In a new terminal type: `sudo dd bs=1m if=2017-06-21-raspbian-jessie.img of=/dev/disk2`
    - You can use press `ctrl-t` to determine how much of the .img file has been copied
  - Insert the SD card into a Raspberry Pi
  - Boot the Pi

# Initial Setup
  - Change password
  - Change system name to "minisub"
  - Turn on VNC
  - Turn on SSH
  - Turn on I2C
  - Reboot

# Update Raspbian
  - Connect to local network/Wi-Fi
  - `sudo apt-get update`
  - `sudo apt-get upgrade`

# Setup Static IP Address

- Edit `/etc/dhcpcd.conf`
- Add the following to the end of the file
```
interface eth0
static ip_address=192.168.0.1/24
```
- reboot
  - `sudo reboot`
- check ip address. It should match the static address in the .conf file
  - `ifconfig eth0`

# Setup uv4l

- `curl http://www.linux-projects.org/listing/uv4l_repo/lrkey.asc | sudo apt-key add -`
- Add `deb http://www.linux-projects.org/listing/uv4l_repo/raspbian/ jessie main` to `/etc/apt/sources.list`
- `sudo apt-get update`
- `sudo apt-get install uv4l uv4l-raspicam uv4l-server uv4l-raspicam-extras`
- Update `/etc/uv4l/uv4l-raspicam.conf`
  - Uncomment and set
    - encoding = mjpeg
    - width = 1296
    - height = 976
    - framerate = 24
    - quality = 10
    - nopreview = yes
  - Restart the service with `sudo service u4vl_raspicam restart`
- Open "http://192.168.0.1:8080/stream" in a browser to confirm video is working

# Install Submarine Software
  - On Pi
    - `sudo apt-get install netatalk`
    - `sudo pip3 install adafruit-pca9685`
  - On Mac
    - `mount -t afp "afp://pi:<password>@minisub.local/Home Directory" "minisub"
    - `cd minisub`
    - `mkdir -p ~/Documents/Projects`
    - `cd ~/Documents/Projects`
    - `git clone https://github.com/gizmo-cda/g2x-submarine-v2.git`
