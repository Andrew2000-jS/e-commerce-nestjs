import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/context/infrastructure/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/context/infrastructure/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
