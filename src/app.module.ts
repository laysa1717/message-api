import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { HealthCheckController } from './presentation/http/controllers/health-check.controller';
import { MessageController } from "./presentation/http/controllers/messages.controller";

import { HealthCheckUseCase } from './application/usecase/health-check.usecase';
import { MessageUseCase } from "./application/usecase/messages.usecase";

import { DynamoModule } from "./infra/dynamodb/dynamo.module";
import { MessageService } from './infra/services/message.service';

import { MESSAGE_REPOSITORY } from "./domain/repositories/message.repository";
import { MessageDynamoRepository } from "./infra/persistence/dynamo/message.dynamo.repository";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DynamoModule
  ],
  controllers: [HealthCheckController, MessageController],
  providers: [
    MessageDynamoRepository, 
    { provide: MESSAGE_REPOSITORY, useExisting: MessageDynamoRepository },
    HealthCheckUseCase, MessageUseCase, MessageService
  ],
})
export class AppModule { }
