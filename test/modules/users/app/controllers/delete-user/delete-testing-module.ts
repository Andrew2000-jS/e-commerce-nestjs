import { UserMockRepository } from '../../../../../__mocks__';
import { DeleteUserCtr } from '@/modules/users/app';
import { CreateUser, DeleteUser } from '@/modules/users/context/application';
import { UserRepository } from '@/modules/users/context/domain';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

export const testingModule = async (): Promise<TestingModule> =>
  await Test.createTestingModule({
    imports: [JwtModule.register({ secret: 'test_secret' })],
    controllers: [DeleteUserCtr],
    providers: [
      DeleteUser,
      CreateUser,
      {
        provide: UserRepository,
        useClass: UserMockRepository,
      },
    ],
  }).compile();
