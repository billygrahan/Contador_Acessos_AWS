import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';
export class BackendInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // 1. Tabela do DynamoDB com a chave fixa "id"
    const table = new dynamodb.Table(this, 'HitsTable', {
      tableName: 'CampanhaEmBreve-Contador',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Escala automaticamente a custo zero se não houver uso
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Altere para RETAIN em ambiente produtivo
    });
    // 2. Função Lambda executando em Node.js (compila e empacota TypeScript nativament via esbuild)
    const counterLambda = new nodejs.NodejsFunction(this, 'CounterLambdaHandler', {
      entry: path.join(__dirname, '../lambda/index.mjs'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        TABLE_NAME: table.tableName,
      },
    });
    // Conceder permissões de leitura e escrita explícitas para a função Lambda
    table.grantReadWriteData(counterLambda);
    // 3. API Gateway atuando como proxy
    const api = new apigateway.RestApi(this, 'CounterApi', {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      }
    });
    const hitsEndpoint = api.root.addResource('hits');
    hitsEndpoint.addMethod('POST', new apigateway.LambdaIntegration(counterLambda));
    // 4. Bucket S3 configurado exclusivamente para hospedagem de Site Estático
    const siteBucket = new s3.Bucket(this, 'StaticSiteBucket', {
      publicReadAccess: true,
      // CORREÇÃO: Desativa explicitamente o blockPublicPolicy para permitir a política pública do site
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: s3.BlockPublicAccess.BLOCK_ACLS.blockPublicAcls,
        ignorePublicAcls: s3.BlockPublicAccess.BLOCK_ACLS.ignorePublicAcls,
        blockPublicPolicy: false,
        restrictPublicBuckets: false,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      websiteIndexDocument: 'index.html',
    });
    // 5. Deploy automatizado dos arquivos do Frontend gerados pelo Vite
    new s3deploy.BucketDeployment(this, 'DeployStaticSite', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../frontend-site/dist'))],
      destinationBucket: siteBucket,
    });
    // Outputs para facilitar o acesso
    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url + 'hits' });
    new cdk.CfnOutput(this, 'WebsiteUrl', { value: siteBucket.bucketWebsiteUrl });
  }
}