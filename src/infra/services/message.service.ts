import { Inject, Injectable } from '@nestjs/common';
import { MESSAGE_REPOSITORY, IMessageRepository } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';

@Injectable()
export class MessageService {
    constructor(@Inject(MESSAGE_REPOSITORY) private readonly repository: IMessageRepository) { }

    async create(message: Message) {
        return await this.repository.save(message);
    }

    async getMessageId(messageId: string) {
        return await this.repository.findById(messageId);
    }

    async getMessageSender(senderMessage: string) {
        return await this.repository.findBySender(senderMessage);
    }

    async updateMessageStatus(messageId: string, status: string) {
        return await this.repository.updateStatus(messageId, status);
    }

    async getMessageRangeDate(dateInit: string, dateEnd: string) {
        return await this.repository.findByRangeDate(dateInit, dateEnd);
    }
    }
