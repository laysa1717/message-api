import { IsNotEmpty, IsDefined, IsString } from "class-validator";

export class CreateMessageDto {

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  conteudo!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  remetente!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class GetMessageIdDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  messageId!: string;
}

export class GetMessageSenderDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  senderMessage!: string;
}