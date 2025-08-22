import { IsNotEmpty, IsDefined, IsString } from "class-validator";

export class CreateMessageDto {

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  sender!: string;

}