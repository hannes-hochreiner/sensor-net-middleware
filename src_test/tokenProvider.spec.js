import {TokenProvider} from '../bld/tokenProvider';
import {SequenceSpy} from './sequenceSpy';

describe('TokenProvider', () => {
  it('be able to get a token', async () => {
    let axiosSpy = new SequenceSpy([
      {name: 'fun', args:[{
        method: 'post',
        url: `https://tenant.region.auth0.com/oauth/token`,
        headers: {'content-type': 'application/json'},
        data: {
          'client_id': 'client_id',
          'client_secret': 'client_secret',
          'audience': 'audience',
          'grant_type': 'client_credentials'
        }
      }], return: {
        data: {
          token_type: 'token_type',
          expires_in: 14,
          access_token: 'access_token'
        }
      }}
    ]);
    let tp = new TokenProvider(axiosSpy.fun, Date.bind(null, '2020-04-26T18:00:00.000Z'));
    expect(await tp._getNewToken({
      tenant: 'tenant',
      region: 'region',
      client_id: 'client_id',
      client_secret: 'client_secret',
      audience: 'audience'
    })).toEqual({
      token_type: 'token_type',
      expires_at: new Date('2020-04-26T18:00:04.000Z'),
      access_token: 'access_token'
    });
  });

  it('be able to produce an authentication header', async () => {
    let past = new Date();
    past.setSeconds(past.getSeconds() - 15);
    let future = new Date();
    future.setSeconds(future.getSeconds() + 100);

    let axiosSpy = new SequenceSpy([
      {name: 'tmpFun', args:[{
        config: true
      }], return: {
        token_type: 'token_type',
        expires_at: past,
        access_token: 'access_token'
      }},
      {name: 'tmpFun', args:[{
        config: true
      }], return: {
        token_type: 'token_type1',
        expires_at: future,
        access_token: 'access_token1'
      }}
    ]);

    let tp = new TokenProvider(null, Date);

    tp._getNewToken = axiosSpy.tmpFun;

    expect(await tp.getAuthenticationHeader({config: true})).toEqual('token_type access_token');
    expect(await tp.getAuthenticationHeader({config: true})).toEqual('token_type1 access_token1');
    expect(await tp.getAuthenticationHeader({config: true})).toEqual('token_type1 access_token1');
  });
});
