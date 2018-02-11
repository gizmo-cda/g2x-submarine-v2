# Communications Module

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
