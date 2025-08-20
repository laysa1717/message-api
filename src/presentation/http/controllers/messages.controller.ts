import { Controller, Get, Post, Patch, Body, HttpCode, HttpStatus, UsePipes, Query } from '@nestjs/common';
import { MessageUseCase } from '../../../application/usecase/messages.usecase';
import { CreateMessageDto, GetMessageIdDto, GetMessageSenderDto} from "../dto/message.request.dto";
import { RequiredFieldsValidationPipe } from '../pipes/required-fields.validation-pipe';


@Controller('/v1')
export class MessageController {
  constructor(private readonly messageUsecase: MessageUseCase) {}

  @Post('create-message')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new RequiredFieldsValidationPipe(['conteudo', 'remetente']))
  async create(@Body() dto: CreateMessageDto){
   return await this.messageUsecase.createMessage({
        conteudo: dto.conteudo,
        remetente: dto.remetente,
        status: dto.status
    })

  }

  @Get('get-message-id')
  @UsePipes(new RequiredFieldsValidationPipe(['messageId']))
  getMessageId(@Body() dto: GetMessageIdDto) {
    return this.messageUsecase.getMessageId(dto.messageId);
  }
  
  @Get('get-message-sender')
  @UsePipes(new RequiredFieldsValidationPipe(['senderMessage']))
  getMessageSender(@Body() dto: GetMessageSenderDto) {
    console.log(dto);
    return this.messageUsecase.getMessagesBySender(dto.senderMessage);
  }

  @Get()
  getMessageRangeDate(): string {
    return this.messageUsecase.getMessageRangeDate();
  }

  @Patch()
  updateStatusMessage(): string {
    return this.messageUsecase.updateStatusMessage();
  }
}
