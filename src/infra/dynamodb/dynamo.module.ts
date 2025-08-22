// src/infrastructure/dynamodb/dynamo.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DYNAMO_DOCUMENT_CLIENT } from './tokens';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DYNAMO_DOCUMENT_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const region =
          config.get<string>('AWS_REGION') ??
          config.get<string>('AWS_DEFAULT_REGION') ??
          'us-east-1';

        const clientConfig: DynamoDBClientConfig = { region };

        const endpoint = config.get<string>('DYNAMO_ENDPOINT');
        if (endpoint) {
          clientConfig.endpoint = endpoint;
        }

        const accessKeyId = config.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = config.get<string>('AWS_SECRET_ACCESS_KEY');
        if (accessKeyId && secretAccessKey) {
          clientConfig.credentials = { accessKeyId, secretAccessKey };
        }

        const client = new DynamoDBClient(clientConfig);

        return DynamoDBDocumentClient.from(client, {
          marshallOptions: { removeUndefinedValues: true },
        });
      },
    },
  ],
  exports: [DYNAMO_DOCUMENT_CLIENT],
})
export class DynamoModule {}
