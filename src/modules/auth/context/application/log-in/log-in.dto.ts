import { IsNotEmpty, IsString } from 'class-validator';

export class LogInDto {
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @IsNotEmpty()
  password: string;
}
