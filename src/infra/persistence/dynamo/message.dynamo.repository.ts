// src/infrastructure/persistence/dynamo/message.dynamo.repository.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';
import { IMessageRepository } from '../../../domain/repositories/message.repository';
import { Message, MessageStatus } from '../../../domain/entities/message.entity';
import { DYNAMO_DOCUMENT_CLIENT } from '../../dynamodb/tokens';

@Injectable()
export class MessageDynamoRepository implements IMessageRepository {
  private table: string;

  constructor(
    @Inject(DYNAMO_DOCUMENT_CLIENT)
    private readonly docClient: DynamoDBDocumentClient,
    private readonly config: ConfigService,
  ) {
    this.table = this.config.get<string>('MESSAGES') ?? 'MESSAGES';
  }

  async save(message: Message): Promise<void> {    
    await this.docClient.send(
      new PutCommand({
        TableName: this.table,
        Item: message,
        ConditionExpression: 'attribute_not_exists(id)',
      }),
    );    
  }

  async findById(id: string): Promise<Message | null> {    
    const out = await this.docClient.send(
      new GetCommand({ TableName: this.table, Key: { id } }),
    );    
    return (out.Item as Message) ?? null;
  }

  async updateStatus(id: string, status: MessageStatus): Promise<void> {
    await this.docClient.send(
      new UpdateCommand({
        TableName: this.table,
        Key: { id },
        UpdateExpression: 'SET #s = :s, updatedAt = :now',
        ExpressionAttributeNames: { '#s': 'status' },
        ExpressionAttributeValues: {
          ':s': status,
          ':now': new Date().toISOString(),
        },
        ConditionExpression: 'attribute_exists(id)',
      }),
    );
  }

  async findBySender(senderMessage: string): Promise<Message[]> {
    console.log(`Buscando mensagens para o remetente: ${senderMessage}`);
    const queryCommand = new QueryCommand({
        TableName: this.table,
        IndexName: 'remetente-index',
        KeyConditionExpression: 'remetente = :remetente',
        ExpressionAttributeValues: { ':remetente': senderMessage },
    });
    const out = await this.docClient.send(queryCommand);
    return (out.Items as Message[]) ?? [];
  }
}
