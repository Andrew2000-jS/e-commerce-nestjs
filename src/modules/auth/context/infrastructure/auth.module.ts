import { Module } from '@nestjs/common';
import { LogIn, MatchUser } from '../application';
import { LogInCtr } from '../../app';
import { PostgresqlAuthRepository } from './persistence';
import { AuthRepository } from '../domain';

@Module({
  controllers: [LogInCtr],
  providers: [
    LogIn,
    MatchUser,
    PostgresqlAuthRepository,
    {
      provide: AuthRepository,
      useExisting: PostgresqlAuthRepository,
    },
  ],
  exports: [LogIn, MatchUser],
})
export class AuthModule {}
