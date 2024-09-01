import { UserMockRepository } from '../../../../../__mocks__';
import { AuthGuard } from '@/modules/shared';
import { UpdateUserCtr } from '@/modules/users/app';
import { CreateUser, UpdateUser } from '@/modules/users/context/application';
import { UserRepository } from '@/modules/users/context/domain';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

export const testingModule = async (): Promise<TestingModule> =>
  await Test.createTestingModule({
    imports: [JwtModule.register({ secret: 'test_secret' })],
    controllers: [UpdateUserCtr],
    providers: [
      UpdateUser,
      CreateUser,
      AuthGuard,
      {
        provide: UserRepository,
        useClass: UserMockRepository,
      },
    ],
  }).compile();
