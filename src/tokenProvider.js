export class TokenProvider {
  constructor(axios, dateType) {
    this._axios = axios;
    this._DateType = dateType;
  }

  // conf
  // {
  //   tenant
  //   region
  //   client_id
  //   client_secret
  //   audience
  // }
  async getAuthenticationHeader(conf) {
    if (typeof this._token == 'undefined' || ((this._token.expires_at - (new this._DateType())) < 0)) {
      this._token = await this._getNewToken(conf);
    }

    return `${this._token.token_type} ${this._token.access_token}`;
  }

  async _getNewToken(conf) {
    const res = await this._axios({
      method: 'post',
      url: `https://${conf.tenant}.${conf.region}.auth0.com/oauth/token`,
      headers: {'content-type': 'application/json'},
      data: {
        'client_id': conf.client_id,
        'client_secret':conf.client_secret,
        'audience': conf.audience,
        'grant_type': 'client_credentials'
      }
    });

    let now = new this._DateType();
    
    now.setUTCSeconds(now.getUTCSeconds() + res.data.expires_in - 10);

    return {
      token_type: res.data.token_type,
      expires_at: now,
      access_token: res.data.access_token
    };
  }
}
