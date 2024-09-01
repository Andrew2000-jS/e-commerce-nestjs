import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/context/infrastructure/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/context/infrastructure/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ secret: process.env.TOKEN_SECRET, global: true }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
