import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Message } from "../../domain/entities/message.entity";
import { MessageService } from "../../infra/services/message.service";
import { randomUUID } from "crypto";
import { AlreadyExistsError, DomainError } from '../../domain/exceptions/errors';

type Payload = {
    conteudo: string;
    remetente: string;
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
            payload.conteudo,
            payload.remetente,
            payload.status,
            date,
            date
        );
        try {
            await this.serviceMessage.create(messagePayload);
            return { success: true, message: 'Mensagem criada com sucesso.', id: messageId, status: 201 };
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
                message: 'Falha ao criar a mensagem.',
                details: { cause: error.message },
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async getMessageId(messageId: string) {
        try {
            const result = await this.serviceMessage.getMessageId(messageId);
            if (result === null) {
                throw new DomainError('Mensagem não encontrada.', { id: messageId });
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
                message: 'Erro interno do servidor.',
                details: { cause: error.message },
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getMessagesBySender(senderMessage: string) {
        try {
            const results = await this.serviceMessage.getMessageSender(senderMessage);
            if (results.length === 0) {
                throw new DomainError('Nenhuma mensagem encontrada para o remetente.', { senderMessage });
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
                message: 'Erro interno do servidor.',
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