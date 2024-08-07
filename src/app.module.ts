import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/context/infrastructure/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
