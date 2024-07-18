import { Module } from '@nestjs/common';
import { CreateUser, DeleteUser, MatchUser, UpdateUser } from '../application';
import {
  CreateUserCtr,
  DeleteUserCtr,
  MatchUserCtr,
  UpdateUserCtr,
} from '../../app';
import { UserRepository } from '../domain';
import { PostgresqlUserRepository } from './persistence';

@Module({
  controllers: [CreateUserCtr, UpdateUserCtr, DeleteUserCtr, MatchUserCtr],
  providers: [
    CreateUser,
    UpdateUser,
    DeleteUser,
    MatchUser,
    PostgresqlUserRepository,
    {
      provide: UserRepository,
      useExisting: PostgresqlUserRepository,
    },
  ],
  exports: [CreateUser, UpdateUser, DeleteUser, MatchUser],
})
export class UsersModule {}
