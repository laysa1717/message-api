import { Test, TestingModule } from '@nestjs/testing';
import { MessageUseCase } from '../../src/application/usecase/messages.usecase';
import { MessageService } from '../../src/infra/services/message.service';
import { AlreadyExistsError } from '../../src/domain/exceptions/errors';

jest.mock('../../src/infra/services/message.service');

jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('MessageUseCase', () => {
  let messageUseCase: MessageUseCase;
  let messageService: jest.Mocked<MessageService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageUseCase,
        MessageService,
      ],
    }).compile();

    messageUseCase = module.get<MessageUseCase>(MessageUseCase);
    messageService = module.get(MessageService);
  });

  it('should create a message successfully', async () => {
    messageService.create.mockResolvedValue(undefined);

    const payload = { content: 'Mensagem escrita para testes', sender: 'laysa.santos@email.com', status: 'created' };
    const result = await messageUseCase.createMessage(payload);

    expect(result).toEqual({
      success: true,
      message: 'Message created successfully',
      id: expect.any(String),
      status: 201,
    });
    expect(messageService.create).toHaveBeenCalledWith(expect.objectContaining({
      content: payload.content,
      sender: payload.sender,
    }));
  });

  it('should throw an error if message already exists', async () => {
    messageService.create.mockRejectedValue(new AlreadyExistsError('Message already exists'));

    const payload = { content: 'Mensagem escrita para testes', sender: 'laysa.santos@email.com', status: 'created' };

    await expect(messageUseCase.createMessage(payload)).rejects.toThrow('Message already exists');
  });
});
