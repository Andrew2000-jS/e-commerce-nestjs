import { UserMockRepository } from '../../../../../__mocks__';
import { CreateUser, UpdateUser } from '@/modules/users/context/application';
import { UserRepository } from '@/modules/users/context/domain';
import { Test, TestingModule } from '@nestjs/testing';

export const testingModule = async (): Promise<TestingModule> =>
  await Test.createTestingModule({
    providers: [
      UpdateUser,
      CreateUser,
      {
        provide: UserRepository,
        useClass: UserMockRepository,
      },
    ],
  }).compile();
