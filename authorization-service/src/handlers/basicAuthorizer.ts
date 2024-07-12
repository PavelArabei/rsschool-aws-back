import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayTokenAuthorizerHandler,
} from 'aws-lambda';
import { createResponse } from './helpers/createResponse';
import { StatementEffect } from 'aws-lambda/trigger/api-gateway-authorizer';

export const handler: APIGatewayTokenAuthorizerHandler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {

  console.log('event', event);
  const login = process.env.LOGIN || '';
  const password = process.env.PASSWORD || '';

  let effect: StatementEffect = 'Deny';


  const token = event.authorizationToken.split(' ')[1];

  if (!token) {
    console.log(`token`, token);
    return createResponse(effect, event.methodArn);
  }


  const buf = Buffer.from(token, 'base64').toString('utf-8');
  console.log(buf);
  const [user, pass] = buf.split(':');


  console.log('user', user, 'pass', pass);

  if (user === login || pass === password) effect = 'Allow';

  console.log('effect', effect);
  return createResponse(effect, event.methodArn);

};
