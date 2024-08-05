import { UserMockRepository } from '../../../../../__mocks__';
import { Uuid } from '@/modules/shared';
import { CreateUser } from '@/modules/users/context/application';
import { User, UserRepository } from '@/modules/users/context/domain';
import { Test, TestingModule } from '@nestjs/testing';

describe('Create user use case', () => {
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
    const mockUser = {
      name: 'Jhon',
      lastName: 'Doe',
      userName: 'jhonDoe123',
      email: 'jhondoe@mail.com',
      password: 'MyNotT0We@kP@$$Word',
    };

    // When: Execute the use case to create a new user
    const user = await service.run(mockUser);

    // Then: Verify that the create method was called with the created user
    repository.assertCreateHaveBeenCalledWith(User.fromPrimitives(user));
  });

  it('should throw if user already exist', async () => {
    // Given: Data for the new user to be created
    const mockUser = {
      name: 'Jhon',
      lastName: 'Doe',
      userName: 'jhonDoe123',
      email: 'jhondo@email.com',
      password: 'MyNotT0We@kP@$$Word',
    };

    // When: Execute the use case to create a new user
    await service.run(mockUser);

    // When & Then: Expect the service to throw an error when an create an existing user
    await expect(service.run(mockUser)).rejects.toThrow();
  });

  it('should throw if email is invalid', async () => {
    // Given: Invalid data for the new user to be created
    const mockUser = {
      name: 'Jhon',
      lastName: 'Doe',
      userName: 'jhonDoe123',
      email: 'jhondoemail.com',
      password: 'MyNotT0We@kP@$$Word',
    };

    // When & Then: Expect the service to throw an error when an invalid email is used
    await expect(service.run(mockUser)).rejects.toThrow();
  });

  it('should throw if password is weak', async () => {
    // Given: Invalid data for the new user to be created
    const mockUser = {
      id: Uuid(),
      name: 'Jhon',
      lastName: 'Doe',
      userName: 'jhonDoe123',
      email: 'jhondoemail.com',
      password: 'abc123',
    };

    // When & Then: Expect the service to throw an error when an invalid password is used
    await expect(service.run(mockUser)).rejects.toThrow();
  });

  it('should throw if name or last name has invalid characters', async () => {
    // Given: Invalid data for the new user to be created
    const mockUser = {
      name: 'Jhon5',
      lastName: 'Doe@',
      userName: 'jhonDoe123',
      email: 'jhondoemail.com',
      password: 'abc123',
    };

    // When & Then: Expect the service to throw an error when an invalid firts or last name is used
    await expect(service.run(mockUser)).rejects.toThrow();
  });
});
