#!/usr/bin/env node

import * as crypto from 'crypto';
import {default as SerialPort} from 'serialport';
import {default as Readline} from '@serialport/parser-readline';
import {Publisher} from 'zeromq';
import {DataDecoder} from './dataDecoder';
import {MessageProcessor} from './messageProcessor';

const port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 1000000
});
const parser = port.pipe(new Readline());
const dataDecoder = new DataDecoder(crypto);
const messageProcessor = new MessageProcessor();
const sock = new Publisher();
const key = process.env.SENSOR_NET_KEY;
const socket = process.env.ZEROMQ_SOCKET;

async function init() {
  await sock.bind(socket);
  console.log(`Raw Data Daemon bound to socket "${socket}".`);
  parser.on('data', processData);
}

async function processData(data) {
  try {
    let dt = JSON.parse(data);
    const plain = dataDecoder.decodeHex(dt.data, key);
    let msg = {
      type: dt.type,
      rssi: dt.rssi,
      timestamp: (new Date()).toISOString(),
      message: messageProcessor.processMessage(plain)
    }
    console.dir(msg, {depth: 10});
    await sock.send(['sensor-net/data', msg]);
  } catch (error) {
    console.log(data);
    console.log(error);
  }
}

init();
