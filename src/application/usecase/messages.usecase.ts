import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Message } from "../../domain/entities/message.entity";
import { MessageService } from "../../infra/services/message.service";
import { randomUUID } from "crypto";
import { AlreadyExistsError, DomainError } from '../../domain/exceptions/errors';

type Payload = {
    content: string;
    sender: string;
    status: string;
  };
  
@Injectable()
export class MessageUseCase {

    constructor(private readonly serviceMessage: MessageService){}

    async createMessage(payload: Payload) {
        const date = new Date().toString();
        const messageId = randomUUID();
        const messagePayload = new Message(
            messageId,
            payload.content,
            payload.sender,
            payload.status,
            date,
            date
        );
        try {
            await this.serviceMessage.create(messagePayload);
            return { success: true, message: 'Message created successfully', id: messageId, status: 201 };
        } catch (error) {
            if (error instanceof AlreadyExistsError) {
                throw new HttpException({
                    statusCode: HttpStatus.CONFLICT,
                    message: error.message,
                    details: error.details,
                }, HttpStatus.CONFLICT);
            }
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Failed to create the message.',
                details: { cause: error.message },
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async getMessageId(messageId: string) {
        try {
            const result = await this.serviceMessage.getMessageId(messageId);
            if (result === null) {
                throw new DomainError('Message not found.', { id: messageId });
            }
            return { success: true, data: result, status: 200 };
        } catch (error) {
            if (error instanceof DomainError) {
                throw new HttpException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: error.message,
                    details: error.details,
                }, HttpStatus.NOT_FOUND);
            }
            throw new HttpException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error.',
                details: { cause: error.message },
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getMessagesBySender(senderMessage: string) {
        try {
            const results = await this.serviceMessage.getMessageSender(senderMessage);
            if (results.length === 0) {
                throw new DomainError('No messages found for the sender.', { senderMessage });
            }
            return { success: true, data: results, status: 200 };
        } catch (error) {
            if (error instanceof DomainError) {
                throw new HttpException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: error.message,
                    details: error.details,
                }, HttpStatus.NOT_FOUND);
            }
            throw new HttpException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error.',
                details: { cause: error.message },
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    getMessageRangeDate(){
        return 'range date'
    }

    updateStatusMessage(){
        return 'sender'
    }
}