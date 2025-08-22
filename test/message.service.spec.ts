import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from '../src/infra/services/message.service';
import { IMessageRepository, MESSAGE_REPOSITORY } from '../src/domain/repositories/message.repository';
import { Message } from '../src/domain/entities/message.entity';

const mockMessageRepository = () => ({
  save: jest.fn(),
  findById: jest.fn(),
  findBySender: jest.fn(),
  updateStatus: jest.fn(),
  findByRangeDate: jest.fn(),
});

describe('MessageService', () => {
  let messageService: MessageService;
  let messageRepository: jest.Mocked<IMessageRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        { provide: MESSAGE_REPOSITORY, useFactory: mockMessageRepository },
      ],
    }).compile();
  
    messageService = module.get<MessageService>(MessageService);
    messageRepository = module.get(MESSAGE_REPOSITORY) as jest.Mocked<IMessageRepository>;
  });

  it('should create a message', async () => {
    const message = new Message('1', 'Hello', 'user@example.com', 'created', '2023-01-01', '2023-01-01');
    await messageService.create(message);
    expect(messageRepository.save).toHaveBeenCalledWith(message);
  });

  it('should get a message by ID', async () => {
    const message = new Message('1', 'Hello', 'user@example.com', 'created', '2023-01-01', '2023-01-01');
    messageRepository.findById.mockResolvedValue(message);
    const result = await messageService.getMessageId('1');
    expect(result).toEqual(message);
    expect(messageRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should get messages by sender', async () => {
    const messages = [new Message('1', 'Hello', 'user@example.com', 'created', '2023-01-01', '2023-01-01')];
    messageRepository.findBySender.mockResolvedValue(messages);
    const result = await messageService.getMessageSender('user@example.com');
    expect(result).toEqual(messages);
    expect(messageRepository.findBySender).toHaveBeenCalledWith('user@example.com');
  });

  it('should update message status', async () => {
    await messageService.updateMessageStatus('1', 'read');
    expect(messageRepository.updateStatus).toHaveBeenCalledWith('1', 'read');
  });

  it('should get messages by date range', async () => {
    const messages = [new Message('1', 'Hello', 'user@example.com', 'created', '2023-01-01', '2023-01-01')];
    messageRepository.findByRangeDate.mockResolvedValue(messages);
    const result = await messageService.getMessageRangeDate('2023-01-01', '2023-01-31');
    expect(result).toEqual(messages);
    expect(messageRepository.findByRangeDate).toHaveBeenCalledWith('2023-01-01', '2023-01-31');
  });
});
