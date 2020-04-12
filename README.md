# Sensor Net Middleware
This repository contains the middleware for the Sensor Net project.

## Installation
The middleware can be installed as an npm package.

```shell
apt install git libzmq-dev cmake -y
npm i -g sensor-net-middleware
```

You may need to add the option "--unsafe-perm".

## Running
The middleware package contains a binary called "rawdatad".
It expects the Sensor Net decryption key to be supplied as the environment variable "SENSOR_NET_KEY".
```shell
SENSOR_NET_KEY=<secret key> rawdatad
```

# Troubleshooting
## Installing nodejs on armv6l (RaspberryPi 1, Zero)
I found the node packages that ship with Raspbian to have problems.
Therefore, I uninstalled them.

```shell
apt remove nodejs npm
```

Binary distributions packages for armv6 are available for [version 10 from nodejs.org](https://nodejs.org/dist/latest-v10.x/).
They can be installed in the following way.

```shell
wget https://nodejs.org/dist/latest-v10.x/node-v10.20.0-linux-armv6l.tar.gz
sudo mkdir -p /usr/local/lib/nodejs
sudo tar -xvf node-v10.20.0-linux-armv6l.tar.gz -C /usr/local/lib/nodejs
chown -R root /usr/local/lib/nodejs
chgrp -R root /usr/local/lib/nodejs
```
Then add the path to the profile.
```
export PATH="/usr/local/lib/nodejs/node-v10.20.0-linux-armv6l/bin:$PATH"
```
