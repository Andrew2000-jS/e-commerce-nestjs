import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUser, CreateUserDto } from '../../../context/application';
import { UserPrimitives } from '../../../context/domain';
import { UserErrorHanlder } from '../../utils';

@Controller('/users')
export class CreateUserCtr {
  constructor(private readonly createUser: CreateUser) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @UserErrorHanlder()
  async run(@Body() createUserDto: CreateUserDto): Promise<UserPrimitives> {
    return await this.createUser.run(createUserDto);
  }
}
