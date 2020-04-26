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
The middleware package contains two binaries called "rawdatad" and "ingresd".
### rawdatad
The Raw Data Daemon received the messages from the serial interface, decrypts and reformats them, and publishes them on a zeromq queue.
It expects the Sensor Net decryption key to be supplied as the environment variable "SENSOR_NET_KEY".
```shell
SENSOR_NET_KEY=<secret key> ZEROMQ_SOCKET=tcp://127.0.0.1:3000 rawdatad
```
### ingressd
The Ingress Daemon subscribes to the zeromq queue and forwards the messages to the database.
To be able to use the Sensor Net back end API, it gets an access token from Auth0.
It gets new tokens as required.
The Ingress Daemon expects the following environment variables to be set:
  * ZEROMQ_SOCKET (optional, default: "tcp://127.0.0.1:3000")
  * ZEROMQ_TOPIC (optional, default: "sensor-net/data")
  * AUTH0_TENANT
  * AUTH0_REGION (e.g. "eu")
  * AUTH0_CLIENT_ID
  * AUTH0_CLIENT_SECRET
  * AUTH0_CLIENT_AUDIENCE

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
