#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();

const isLocal = process.env.IS_LOCAL === 'true' || process.env.IS_LOCAL === '1';

new InfraStack(app, 'Test1Stack', {
  isLocal,
  localEndpoints: isLocal ? {
    dynamodb: 'http://localhost:4566',
    appsync: 'http://localhost:4566',
  } : undefined,
  env: {
    account: process.env.AWS_ACCOUNT_ID || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.AWS_REGION || process.env.CDK_DEFAULT_REGION || 'us-east-1',
  }
});
