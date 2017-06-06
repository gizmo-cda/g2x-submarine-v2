# Streaming Module

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
