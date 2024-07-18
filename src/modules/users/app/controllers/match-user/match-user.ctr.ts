import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MatchUser } from '../../../context/application';
import { UserPrimitives } from 'src/modules/users/context/domain';
import { Criteria } from 'src/modules/shared';
import { UserErrorHanlder } from '../../utils';

@Controller('/users')
export class MatchUserCtr {
  constructor(private readonly matchUser: MatchUser) {}

  @Post('/match')
  @HttpCode(HttpStatus.OK)
  @UserErrorHanlder()
  async run(@Body() body: Record<string, any>): Promise<UserPrimitives | null> {
    const criteria = new Criteria(body);
    return await this.matchUser.run(criteria);
  }
}
