import {
  Controller,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { DeleteUser, DeleteUserDto } from '../../../context/application';
import { UserErrorHanlder } from '../../utils';
import { AuthGuard } from '@/modules/shared';

@Controller('/users')
@UseGuards(AuthGuard)
export class DeleteUserCtr {
  constructor(private readonly deleteUser: DeleteUser) {}

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UserErrorHanlder()
  async run(@Param() deleteUserDto: DeleteUserDto): Promise<void> {
    return await this.deleteUser.run(deleteUserDto);
  }
}
