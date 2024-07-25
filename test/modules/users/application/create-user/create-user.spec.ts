import { UserMockRepository } from '../../../../__mocks__';
import { Uuid } from '@/modules/shared';
import { CreateUser } from '@/modules/users/context/application';
import {
  User,
  UserPrimitives,
  UserRepository,
} from '@/modules/users/context/domain';
import { Test, TestingModule } from '@nestjs/testing';

describe('Create use use case', () => {
  let service: CreateUser;
  let repository: UserMockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUser,
        {
          provide: UserRepository,
          useClass: UserMockRepository,
        },
      ],
    }).compile();

    service = module.get<CreateUser>(CreateUser);
    repository = module.get<UserMockRepository>(UserRepository);
  });

  it('should create a new user', async () => {
    // Given: Data for the new user to be created
    const mockUser: UserPrimitives = {
      id: Uuid(),
      name: 'Jhon',
      lastName: 'Doe',
      userName: 'jhonDoe123',
      email: 'jhondoe@mail.com',
      password: 'MyNotT0We@kP@$$Word',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // When: Execute the use case to create a new user
    const user = await service.run(mockUser);

    // Then: Verify that the create method was called with the created user
    repository.assertCreateHaveBeenCalledWith(User.fromPrimitives(user));
  });

  it('should fail if email is invalid', async () => {
    // Given: Invalid data for the new user to be created
    const mockUser: UserPrimitives = {
      id: Uuid(),
      name: 'Jhon',
      lastName: 'Doe',
      userName: 'jhonDoe123',
      email: 'jhondoemail.com',
      password: 'MyNotT0We@kP@$$Word',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // When & Then: Expect the service to throw an error when an invalid email is used
    await expect(service.run(mockUser)).rejects.toThrow();
  });

  it('should fail if password is weak', async () => {
    // Given: Invalid data for the new user to be created
    const mockUser: UserPrimitives = {
      id: Uuid(),
      name: 'Jhon',
      lastName: 'Doe',
      userName: 'jhonDoe123',
      email: 'jhondoemail.com',
      password: 'abc123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // When & Then: Expect the service to throw an error when an invalid password is used
    await expect(service.run(mockUser)).rejects.toThrow();
  });

  it('should fail if name or last name has invalid characters', async () => {
    // Given: Invalid data for the new user to be created
    const mockUser: UserPrimitives = {
      id: Uuid(),
      name: 'Jhon5',
      lastName: 'Doe@',
      userName: 'jhonDoe123',
      email: 'jhondoemail.com',
      password: 'abc123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // When & Then: Expect the service to throw an error when an invalid firts or last name is used
    await expect(service.run(mockUser)).rejects.toThrow();
  });
});
