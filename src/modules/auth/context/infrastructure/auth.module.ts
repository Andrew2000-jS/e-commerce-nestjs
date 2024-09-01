import { Module } from '@nestjs/common';
import { LogIn, LogOut, MatchUser } from '../application';
import { LogInCtr, LogOutCtr } from '../../app';
import { PostgresqlAuthRepository } from './persistence';
import { AuthRepository } from '../domain';

@Module({
  controllers: [LogInCtr, LogOutCtr],
  providers: [
    LogIn,
    LogOut,
    MatchUser,
    PostgresqlAuthRepository,
    {
      provide: AuthRepository,
      useExisting: PostgresqlAuthRepository,
    },
  ],
  exports: [LogIn, LogOut, MatchUser],
})
export class AuthModule {}
