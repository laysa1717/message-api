import { Message, MessageStatus } from '../entities/message.entity';

export abstract class IMessageRepository {
  abstract save(message: Message): Promise<void>;
  abstract findById(id: string): Promise<Message | null>;
  abstract updateStatus(id: string, status: MessageStatus): Promise<void>;
  abstract findBySender(sender: string): Promise<Message[]>;
}

export const MESSAGE_REPOSITORY = 'MESSAGE_REPOSITORY';
