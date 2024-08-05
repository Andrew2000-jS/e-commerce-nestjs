import { UserMockRepository } from '../../../../../__mocks__';
import { CreateUser, DeleteUser } from '@/modules/users/context/application';
import { UserRepository } from '@/modules/users/context/domain';
import { Test, TestingModule } from '@nestjs/testing';

describe('Delete user use case', () => {
  let deleteUserService: DeleteUser;
  let createUserService: CreateUser;
  let repository: UserMockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUser,
        CreateUser,
        {
          provide: UserRepository,
          useClass: UserMockRepository,
        },
      ],
    }).compile();

    deleteUserService = module.get<DeleteUser>(DeleteUser);
    createUserService = module.get<CreateUser>(CreateUser);
    repository = module.get<UserMockRepository>(UserRepository);
  });

  it('should delete a user', async () => {
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

    // And: Execute the use case to delete the user
    await deleteUserService.run({ id: user.id });

    // Then: Verify that the delete method was called with the correct user ID
    repository.assertDeleteHaveBeenCalledWith(user.id);
  });

  it('should throw if user does not exist', async () => {
    // Given: A non-existent user ID
    const id = { id: 'noneUserId' };

    // When & Then: Attempting to delete a user with a non-existent ID should throw an error
    await expect(deleteUserService.run(id)).rejects.toThrow();
  });
});
