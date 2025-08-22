import { Module } from '@nestjs/common';
import { MessageDynamoRepository } from '../../infra/persistence/dynamo/message.dynamo.repository';
import { IMessageRepository } from '@/domain/repositories/message.repository';

@Module({
  providers: [
    { provide: IMessageRepository, useClass: MessageDynamoRepository },
  ],
  exports: [IMessageRepository],
})
export class MessagesModule {}
