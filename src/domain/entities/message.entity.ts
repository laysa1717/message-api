import { randomUUID, RandomUUIDOptions } from 'node:crypto';

export enum MessageStatus {
    CREATED = 'created',
    SENT = 'sent',
    RECEIVED = 'received',
    READ = 'read',
  }
  
export class Message {
    constructor(
      public readonly id: string,
      public readonly conteudo: string,
      public readonly remetente: string,
      public readonly status: string,
      public readonly createdAt: string,
      public readonly updatedAt: string,
    ) {}
}
  
