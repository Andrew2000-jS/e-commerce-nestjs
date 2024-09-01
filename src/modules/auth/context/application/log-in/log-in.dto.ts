import { IsNotEmpty, IsString } from 'class-validator';

export class LogInDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  password: string;
}
