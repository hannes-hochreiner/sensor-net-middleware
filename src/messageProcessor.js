export class MessageProcessor {
  _padLeft(string, length) {
    let res = string;

    while (res.length < length) {
      res = '0' + res;
    }

    return res;
  }

  processMessage(message) {
    let res = {};

    switch(message.readUInt16LE()) {
      case 1:
        res.mcuId = `${this._padLeft(message.readUInt32LE(12).toString(16), 8)}-${this._padLeft(message.readUInt32LE(8).toString(16), 8)}-${this._padLeft(message.readUInt32LE(4).toString(16), 8)}`;
        res.index = message.readUInt32LE(16);
        res.measurements = [
          {
            sensorId: this._padLeft(message.readUInt16LE(2).toString(16), 4),
            parameters: {
              temperature: {value: message.readFloatLE(20), unit: '°C'},
              relativeHumidity: {value: message.readFloatLE(24), unit: '%'}
            }
          }
        ];
        break;
      case 2:
        res.mcuId = `${this._padLeft(message.readUInt32LE(12).toString(16), 8)}-${this._padLeft(message.readUInt32LE(8).toString(16), 8)}-${this._padLeft(message.readUInt32LE(4).toString(16), 8)}`;
        res.index = message.readUInt32LE(16);
        res.measurements = [
          {
            sensorId: this._padLeft(message.readUInt16LE(2).toString(16), 4),
            parameters: {
              temperature: {value: message.readFloatLE(20), unit: '°C'},
              relativeHumidity: {value: message.readFloatLE(24), unit: '%'},
              pressure: {value: message.readFloatLE(28), unit: 'mbar'}
            }
          }
        ];
        break;
      default:
        throw new Error('Unknown message type.');
    }

    return res;
  }
}