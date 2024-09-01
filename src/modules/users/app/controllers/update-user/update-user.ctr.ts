import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { UpdateUser, UpdateUserDto } from '../../../context/application';
import { UserPrimitives } from 'src/modules/users/context/domain';
import { UserErrorHanlder } from '../../utils';
import { AuthGuard } from '@/modules/shared';

@Controller('/users')
@UseGuards(AuthGuard)
export class UpdateUserCtr {
  constructor(private readonly updateUser: UpdateUser) {}

  @Patch('/update/:id')
  @UserErrorHanlder()
  async run(
    @Param() { id }: Record<string, any>,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserPrimitives> {
    return await this.updateUser.run(id, updateUserDto);
  }
}
