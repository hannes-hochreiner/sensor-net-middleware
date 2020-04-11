# Sensor Net Middleware
This repository contains the middleware for the Sensor Net project.

## Installation
The middleware can be installed as an npm package.

```shell
npm i -g https://github.com/hannes-hochreiner/sensor-net-middleware.git
```

## Running
The middleware package contains a binary called "rawdatad".
It expects the Sensor Net decryption key to be supplied as the environment variable "SENSOR_NET_KEY".
```shell
SENSOR_NET_KEY=<secret key> rawdatad
```

# References
