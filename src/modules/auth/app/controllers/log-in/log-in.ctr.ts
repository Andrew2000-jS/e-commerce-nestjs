import { LogIn, LogInDto } from '@/modules/auth/context/application';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthErrorHanlder } from '../../utils';

@Controller('/auth')
export class LogInCtr {
  constructor(private readonly logIn: LogIn) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @AuthErrorHanlder()
  async run(@Body() loginDto: LogInDto): Promise<{ token: string }> {
    return await this.logIn.run({ ...loginDto });
  }
}
