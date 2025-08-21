import { Injectable, HttpException, HttpStatus, Logger } from "@nestjs/common";
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
    private readonly logger = new Logger(MessageUseCase.name);

    constructor(private readonly serviceMessage: MessageService){}

    async createMessage(payload: Payload) {
        this.logger.log('Creating a new message');
        const date = new Date().toString();
        const messageId = randomUUID();
        const messagePayload = new Message(
            messageId,
            payload.content,
            payload.sender,
            'created',
            date,
            date
        );
        try {
            await this.serviceMessage.create(messagePayload);
            this.logger.log(`Message created successfully with ID: ${messageId}`);
            return { success: true, message: 'Message created successfully', id: messageId, status: HttpStatus.CREATED };
        } catch (error) {
            this.logger.error('Error creating message', error.stack);
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
        this.logger.log(`Retrieving message with ID: ${messageId}`);
        try {
            const message = await this.serviceMessage.getMessageId(messageId);
            if (!message) {
                this.logger.warn(`Message with ID: ${messageId} not found`);
                throw new HttpException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Message not found.',
                    details: { id: messageId },
                }, HttpStatus.NOT_FOUND);
            }
            this.logger.log(`Message with ID: ${messageId} retrieved successfully`);
            return { success: true, data: message, status: HttpStatus.OK };
        } catch (error) {
            this.logger.error('Error retrieving message', error.stack);
            throw error;
        }
    }

    async getMessagesBySender(senderMessage: string) {
        this.logger.log(`Retrieving messages by sender: ${senderMessage}`);
        try {
            const results = await this.serviceMessage.getMessageSender(senderMessage);
            if (results.length === 0) {
                this.logger.warn(`No messages found for sender: ${senderMessage}`);
                throw new DomainError('No messages found for the sender.', { senderMessage });
            }
            this.logger.log(`Messages retrieved successfully for sender: ${senderMessage}`);
            return { success: true, data: results, status: HttpStatus.OK };
        } catch (error) {
            this.logger.error('Error retrieving messages by sender', error.stack);
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

    async getMessageRangeDate(dateInit: string, dateEnd: string) {
        this.logger.log(`Retrieving messages for date range: ${dateInit} to ${dateEnd}`);
        try {
            const result = await this.serviceMessage.getMessageRangeDate(dateInit, dateEnd);
            if (result.length === 0) {
                this.logger.warn(`No messages found for date range: ${dateInit} to ${dateEnd}`);
                throw new DomainError('No messages found for the range date.', {dateInit, dateEnd });
            }
            this.logger.log(`Messages retrieved successfully for date range: ${dateInit} to ${dateEnd}`);
            return { success: true, data: result, status: HttpStatus.OK };
        } catch (error) {
            this.logger.error('Error retrieving messages by date range', error.stack);
            throw new HttpException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error.',
                details: { cause: error.message },
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateStatusMessage(messageId: string, status: string) {
        this.logger.log(`Updating status for message with ID: ${messageId} to ${status}`);
        try {
            await this.serviceMessage.updateMessageStatus(messageId, status);
            this.logger.log(`Message status updated successfully for ID: ${messageId}`);
            return {    
                success: true, 
                message: 'Message status updated successfully.', 
                status: HttpStatus.OK 
            };
        } catch (error) {
            this.logger.error('Error updating message status', error.stack);
            if (error instanceof DomainError) {
                throw new HttpException({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: error.message,
                    details: error.details,
                }, HttpStatus.NOT_FOUND);
            }
            throw new HttpException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Failed to update message status.',
                details: { cause: error.message },
            }, HttpStatus.BAD_REQUEST);
        }
    }
}