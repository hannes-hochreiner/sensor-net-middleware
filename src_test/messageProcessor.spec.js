import {MessageProcessor} from '../bld/messageProcessor';

describe('MessageProcessor', () => {
  it('should be creatable', () => {
    expect(() => {
      new MessageProcessor();
    }).not.toThrow();
  });

  it('should throw an error, if an unknown message type is received', () => {
    let mp = new MessageProcessor();
    let data = Buffer.alloc(32);

    data.writeUInt16LE(120);

    expect(() => {mp.processMessage(data)}).toThrowError('Unknown message type.');
  });
  
  it('should be able to process a type 1 message', () => {
    let mp = new MessageProcessor();
    let data = Buffer.alloc(32);

    data.writeUInt16LE(1);
    data.writeUInt16LE(10, 2);
    data.writeUInt32LE(1030, 4);
    data.writeUInt32LE(2030, 8);
    data.writeUInt32LE(130, 12);
    data.writeUInt32LE(23420, 16);
    data.writeFloatLE(18.23124, 20);
    data.writeFloatLE(57.21341, 24);
    data.writeFloatLE(1020.12311, 28);

    let msg = mp.processMessage(data);

    expect(msg.mcuId).toEqual('00000082-000007ee-00000406');
    expect(msg.index).toEqual(23420);
    expect(msg.measurements.length).toEqual(1);
    expect(msg.measurements[0].sensorId).toEqual('000a');
    expect(msg.measurements[0].parameters.temperature.value).toBeCloseTo(18.23124);
    expect(msg.measurements[0].parameters.temperature.unit).toEqual('°C');
    expect(msg.measurements[0].parameters.relativeHumidity.value).toBeCloseTo(57.21341);
    expect(msg.measurements[0].parameters.relativeHumidity.unit).toEqual('%');
  });

  it('should be able to process a type 1 message', () => {
    let mp = new MessageProcessor();
    let data = Buffer.alloc(32);

    data.writeUInt16LE(2);
    data.writeUInt16LE(40961, 2);
    data.writeUInt32LE(1030, 4);
    data.writeUInt32LE(2030, 8);
    data.writeUInt32LE(206087314, 12);
    data.writeUInt32LE(23420, 16);
    data.writeFloatLE(18.23124, 20);
    data.writeFloatLE(57.21341, 24);
    data.writeFloatLE(1020.12311, 28);

    let msg = mp.processMessage(data);

    expect(msg.mcuId).toEqual('0c48a492-000007ee-00000406');
    expect(msg.index).toEqual(23420);
    expect(msg.measurements.length).toEqual(1);
    expect(msg.measurements[0].sensorId).toEqual('a001');
    expect(msg.measurements[0].parameters.temperature.value).toBeCloseTo(18.23124);
    expect(msg.measurements[0].parameters.temperature.unit).toEqual('°C');
    expect(msg.measurements[0].parameters.relativeHumidity.value).toBeCloseTo(57.21341);
    expect(msg.measurements[0].parameters.relativeHumidity.unit).toEqual('%');
    expect(msg.measurements[0].parameters.pressure.value).toBeCloseTo(1020.12311);
    expect(msg.measurements[0].parameters.pressure.unit).toEqual('mbar');
  });
});
