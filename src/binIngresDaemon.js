#!/usr/bin/env node

import {Subscriber} from 'zeromq';
import {default as axios} from 'axios';
import {TokenProvider} from './tokenProvider';

const tokenProvider = new TokenProvider(axios, Date);
const sock = new Subscriber();
const socket = process.env.ZEROMQ_SOCKET || 'tcp://127.0.0.1:3000';
const topic = process.env.ZEROMQ_TOPIC || 'sensor-net/data';
const conf = {
  tenant: process.env.AUTH0_TENANT,
  region: process.env.AUTH0_REGION,
  client_id: process.env.AUTH0_CLIENT_ID,
  client_secret: process.env.AUTH0_CLIENT_SECRET,
  audience: process.env.AUTH0_CLIENT_AUDIENCE
};

async function init() {
  sock.connect(socket);
  sock.subscribe(topic);
  console.log(`Ingres Daemon listening on socket "${socket}" for topic "${topic}"`);
 
  for await (const [topic, msg] of sock) {
    try {
      console.log('received a message');
      await axios({
        method: 'PUT',
        url: 'https://ha.hochreiner.net/api/message',
        headers: {
          authorization: await tokenProvider.getAuthenticationHeader(conf)
        },
        data: msg
      });
      console.log('sent message');
    } catch(error) {
      console.log(error);
    }
  }
}

init();
