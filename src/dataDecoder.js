export class DataDecoder {
  constructor(crypto) {
    this._crypto = crypto;
  }

  decodeHex(data, key) {
    const decipher = this._crypto.createDecipheriv('AES-128-ECB', Buffer.from(key, 'hex'), '');
    let dec = [];
    
    decipher.setAutoPadding(false);
    dec.push(decipher.update(Buffer.from(data, 'hex')));
    dec.push(decipher.final());

    return Buffer.concat(dec);
  }
}
