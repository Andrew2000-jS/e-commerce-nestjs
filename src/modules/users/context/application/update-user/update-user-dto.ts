import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  userName?: string;

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @IsStrongPassword()
  @IsNotEmpty()
  @IsOptional()
  password?: string;
}
