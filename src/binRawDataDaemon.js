#!/usr/bin/env node

import * as crypto from 'crypto';
import {default as SerialPort} from 'serialport';
import {default as Readline} from '@serialport/parser-readline';
import {DataDecoder} from './dataDecoder';
import {MessageProcessor} from './messageProcessor';

const port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 1000000
});
const parser = port.pipe(new Readline());
const dataDecoder = new DataDecoder(crypto);
const messageProcessor = new MessageProcessor();
const key = process.env.SENSOR_NET_KEY;

parser.on('data', data => {
  try {
    let dt = JSON.parse(data);
    const plain = dataDecoder.decryptHex(dt.data, key);
    let msg = {
      type: dt.type,
      rssi: dt.rssi,
      timestamp: (new Date()).toISOString(),
      message: messageProcessor.processMessage(plain)
    }
    console.log(msg);
  } catch (error) {
    console.log(data);
    console.log(error);
  }
});
