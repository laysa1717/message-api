import { Controller, Get, Post, Patch, Body, HttpCode, HttpStatus, UsePipes, Param } from '@nestjs/common';
import { MessageUseCase } from '../../../application/usecase/messages.usecase';
import { CreateMessageDto} from "../dto/message.request.dto";
import { RequiredFieldsValidationPipe } from '../pipes/required-fields.validation-pipe';


@Controller('/v1/message')
export class MessageController {
  constructor(private readonly messageUsecase: MessageUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new RequiredFieldsValidationPipe(['content', 'sender']))
  async create(@Body() dto: CreateMessageDto){
   return await this.messageUsecase.createMessage({
        content: dto.content,
        sender: dto.sender,
        status: dto.status
    })

  }

  @Get('messageId/:messageId')
  @UsePipes(new RequiredFieldsValidationPipe(['messageId']))
  getMessageId(@Param('messageId') messageId: string) {
    return this.messageUsecase.getMessageId(messageId);
  }
  
  @Get('senderMessage/:senderMessage')
  @UsePipes(new RequiredFieldsValidationPipe(['senderMessage']))
  getMessageSender(@Param('senderMessage') senderMessage: string) {
    return this.messageUsecase.getMessagesBySender(senderMessage);
  }

  @Get()
  getMessageRangeDate(): string {
    return this.messageUsecase.getMessageRangeDate();
  }

  @Patch('messageId/:messageId/status/:status')
  @UsePipes(new RequiredFieldsValidationPipe(['messageId', 'status']))
  updateStatusMessage(
    @Param('messageId') messageId: string,
    @Param('status') status: string
  ){
    return this.messageUsecase.updateStatusMessage(messageId, status);
  }
}
