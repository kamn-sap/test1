import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';

export interface InfraStackProps extends cdk.StackProps {
  isLocal?: boolean;
  localEndpoints?: {
    dynamodb?: string;
    appsync?: string;
  };
}

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: InfraStackProps) {
    super(scope, id, props);
    
    const isLocal = props?.isLocal || false;
    const dynamodbEndpoint = props?.localEndpoints?.dynamodb;

    // DynamoDB テーブル
    const table = new dynamodb.Table(this, 'TestCasesTable', {
      tableName: 'TestCasesTable',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Lambda 実行ロール
    const lambdaRole = new cdk.aws_iam.Role(this, 'LambdaRole', {
      assumedBy: new cdk.aws_iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    table.grantReadWriteData(lambdaRole);

    // Lambda: テストケース操作
    const testcaseFunction = new lambda.Function(this, 'TestCaseFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda'), {
        exclude: ['*.ts']
      }),
      role: lambdaRole,
      environment: {
        TABLE_NAME: table.tableName,
        DYNAMODB_ENDPOINT: dynamodbEndpoint || '',
        IS_LOCAL: isLocal ? 'true' : 'false',
      },
      timeout: cdk.Duration.seconds(30),
    });

    // Lambda: ペアワイズ生成
    const pairwiseFunction = new lambda.Function(this, 'PairwiseFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'pairwise.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      role: lambdaRole,
      timeout: cdk.Duration.seconds(60),
    });

    // Cognito User Pool (ローカルではダミー)
    const userPool = new cognito.UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      }
    });

    const userPoolClient = userPool.addClient('AppClient', {
      generateSecret: false,
    });

    // AppSync GraphQL API
    const api = new appsync.GraphqlApi(this, 'TestCaseApi', {
      name: 'Test1Api',
      schema: appsync.Schema.fromAsset(path.join(__dirname, '../schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: { userPool }
        }
      }
    });

    // Lambda データソース
    const testcaseDS = api.addLambdaDataSource('TestCaseDS', testcaseFunction);
    const pairwiseDS = api.addLambdaDataSource('PairwiseDS', pairwiseFunction);

    // リゾルバー設定
    testcaseDS.createResolver('CreateTestCaseResolver', {
      typeName: 'Mutation',
      fieldName: 'createTestCase',
      requestMappingTemplate: appsync.MappingTemplate.lambdaRequest(),
      responseMappingTemplate: appsync.MappingTemplate.lambdaResult(),
    });

    testcaseDS.createResolver('GetTestCaseResolver', {
      typeName: 'Query',
      fieldName: 'getTestCase',
      requestMappingTemplate: appsync.MappingTemplate.lambdaRequest(),
      responseMappingTemplate: appsync.MappingTemplate.lambdaResult(),
    });

    testcaseDS.createResolver('ListTestCasesResolver', {
      typeName: 'Query',
      fieldName: 'listTestCases',
      requestMappingTemplate: appsync.MappingTemplate.lambdaRequest(),
      responseMappingTemplate: appsync.MappingTemplate.lambdaResult(),
    });

    pairwiseDS.createResolver('GeneratePairwiseResolver', {
      typeName: 'Query',
      fieldName: 'generatePairwise',
      requestMappingTemplate: appsync.MappingTemplate.lambdaRequest(),
      responseMappingTemplate: appsync.MappingTemplate.lambdaResult(),
    });

    // ホスティング: S3 + CloudFront (本番環境)
    if (!isLocal) {
      const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
        publicReadAccess: true,
        websiteIndexDocument: 'index.html',
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });

      new cloudfront.Distribution(this, 'WebsiteDistribution', {
        defaultBehavior: {
          origin: new cloudfront.origins.S3Origin(websiteBucket)
        },
        defaultRootObject: 'index.html',
      });

      new cdk.CfnOutput(this, 'WebsiteBucketName', {
        value: websiteBucket.bucketName,
      });
    }

    // 出力
    new cdk.CfnOutput(this, 'GraphQLEndpoint', {
      value: api.graphqlUrl,
      description: 'GraphQL API Endpoint'
    });

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });

    new cdk.CfnOutput(this, 'DynamoDBTableName', {
      value: table.tableName,
    });

    // Additional resources (Cognito identity pool, etc.) would go here
  }
}
