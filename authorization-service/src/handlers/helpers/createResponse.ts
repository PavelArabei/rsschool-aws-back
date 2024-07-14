import { APIGatewayAuthorizerResult } from 'aws-lambda';
import { StatementEffect } from 'aws-lambda/trigger/api-gateway-authorizer';

const login = process.env.LOGIN || '';

export const createResponse = (effect: StatementEffect, methodArn: string): APIGatewayAuthorizerResult => {
  return {
    principalId: login,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: ['execute-api:Invoke'],
          Effect: effect,
          Resource: methodArn,
        },
      ],
    },
  };
};

