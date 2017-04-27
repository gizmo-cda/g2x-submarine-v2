# Control Module

## Setup Node

- Remove all node-related packages
	- `sudo apt-get remove nodejs nodejs-legacy nodered`
	- NOTE: you can check what packages are installed that have the text `node` in them using `dpkg --list *node*`
- Install n
	- `curl -L https://git.io/n-install | bash`
- Set environment variables for `n`
	- `. /home/pi/.bashrc`
	- NOTE: you only need to run this right after installation
- Activate node v6.10.2
	- `n 6.10.2`

## Setup uv4l

- `curl http://www.linux-projects.org/listing/uv4l_repo/lrkey.asc | sudo apt-key add`
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

- `sudo apt-get install vim`
- `sudo apt-get install netatalk`
- `sudo pip3 pymongo`

