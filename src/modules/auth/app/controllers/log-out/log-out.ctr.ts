import { LogOut } from '@/modules/auth/context/application';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthErrorHanlder } from '../../utils';
import { AuthGuard } from '@/modules/shared';

@Controller('/auth')
@UseGuards(AuthGuard)
export class LogOutCtr {
  constructor(private readonly logOut: LogOut) {}

  @Post('/logout/:id')
  @HttpCode(HttpStatus.OK)
  @AuthErrorHanlder()
  async run(@Param('id') id: string): Promise<void> {
    return await this.logOut.run(id);
  }
}
