import {DataDecoder} from '../bld/dataDecoder';
import {SequenceSpy} from '../bld_test/sequenceSpy';

describe('DataDecoder', () => {
  it('should be creatable', () => {
    expect(() => {
      new DataDecoder();
    }).not.toThrow();
  });
  it('should call the expected functions', () => {
    let dd = new DataDecoder(new SequenceSpy([
      {name: 'createDecipheriv', args: ['AES-128-ECB', Buffer.from('eeffgg', 'hex'), ''], return: new SequenceSpy([
        {name: 'setAutoPadding', args: [false]},
        {name: 'update', args: [Buffer.from('aabbcc', 'hex')], return: Buffer.from('ccbbaa', 'hex')},
        {name: 'final', return: Buffer.from('', 'hex')}
      ])}
    ]));

    expect(dd.decodeHex('aabbcc', 'eeffgg')).toEqual(Buffer.from('ccbbaa', 'hex'));
  });
});
