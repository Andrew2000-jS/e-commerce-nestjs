import { UserMockRepository } from '../../../../../__mocks__';
import { MatchUserCtr } from '@/modules/users/app';
import { CreateUser, MatchUser } from '@/modules/users/context/application';
import { UserRepository } from '@/modules/users/context/domain';
import { Test, TestingModule } from '@nestjs/testing';

export const testingModule = async (): Promise<TestingModule> =>
  await Test.createTestingModule({
    controllers: [MatchUserCtr],
    providers: [
      MatchUser,
      CreateUser,
      {
        provide: UserRepository,
        useClass: UserMockRepository,
      },
    ],
  }).compile();
