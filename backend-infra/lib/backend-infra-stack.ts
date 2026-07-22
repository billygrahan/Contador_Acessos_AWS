import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';

export class BackendInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const table = new dynamodb.Table(this, 'HitsTable', {
      tableName: 'CampanhaEmBreve-Contador',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const counterLambda = new nodejs.NodejsFunction(
      this,
      'CounterLambdaHandler',
      {
        entry: path.join(__dirname, '../lambda/index.mjs'),
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_20_X,
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
    );

    table.grantReadWriteData(counterLambda);
    const api = new apigwv2.HttpApi(this, 'CounterHttpApi', {
      corsPreflight: {
        allowOrigins: ['*'],
        allowHeaders: ['Content-Type'],
        allowMethods: [
          apigwv2.CorsHttpMethod.POST,
        ],
      },
    });

    api.addRoutes({
      path: '/hits',
      methods: [apigwv2.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration(
        'CounterLambdaIntegration',
        counterLambda,
      ),
    });
    const siteBucket = new s3.Bucket(this, 'StaticSiteBucket', {
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        ignorePublicAcls: false,
        blockPublicPolicy: false,
        restrictPublicBuckets: false,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      websiteIndexDocument: 'index.html',
    });
    new s3deploy.BucketDeployment(this, 'DeployStaticSite', {
      sources: [
        s3deploy.Source.asset(
          path.join(__dirname, '../../frontend-site/dist'),
        ),
      ],
      destinationBucket: siteBucket,
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: `${api.apiEndpoint}/hits`,
    });

    new cdk.CfnOutput(this, 'WebsiteUrl', {
      value: siteBucket.bucketWebsiteUrl,
    });
  }
}