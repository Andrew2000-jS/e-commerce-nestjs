import { UserMockRepository } from '../../../../../__mocks__';
import {
  CreateUser,
  UpdateUser,
  UpdateUserDto,
} from '@/modules/users/context/application';
import { UserRepository } from '@/modules/users/context/domain';
import { TestingModule } from '@nestjs/testing';
import { testingModule } from './update-testing-module';

describe('Updste user use case', () => {
  let updateUserService: UpdateUser;
  let createUserService: CreateUser;
  let repository: UserMockRepository;

  beforeEach(async () => {
    const module: TestingModule = await testingModule();
    updateUserService = module.get<UpdateUser>(UpdateUser);
    createUserService = module.get<CreateUser>(CreateUser);
    repository = module.get<UserMockRepository>(UserRepository);
  });

  it('should can update a user', async () => {
    // Given: Data for the new user to be created
    const mockUser = {
      name: 'Jhon',
      lastName: 'Doe',
      userName: 'jhonDoe123',
      email: 'jhondoe@mail.com',
      password: 'MyNotT0We@kP@$$Word',
    };

    // When: Execute the use case to create a new user
    const user = await createUserService.run(mockUser);

    // And: Execute the use case to update a user
    await updateUserService.run(user.id, {
      name: 'Bill',
      email: 'billdoe@mail.com',
    } as UpdateUserDto);

    // Then: Verify that the update method was called with the correct user ID and updated data
    repository.assertUpdateHaveBeenCalledWith(user.id, {
      name: 'Bill',
      email: 'billdoe@mail.com',
    });
  });

  it('should throw if user does not exist', async () => {
    // Given: A non-existent user ID
    const id = 'non-existing-id';

    // When & Then: Attempting to update a user with a non-existent ID should throw an error
    await expect(
      updateUserService.run(id, {
        name: 'Bill',
        email: 'billdoe@mail.com',
      } as UpdateUserDto),
    ).rejects.toThrow();
  });
});
