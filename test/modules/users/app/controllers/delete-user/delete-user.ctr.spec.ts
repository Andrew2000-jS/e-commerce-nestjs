import { Test, TestingModule } from '@nestjs/testing';
import { UserPrimitives, UserRepository } from '@/modules/users/context/domain';
import { UserMockRepository } from '../../../../../__mocks__';
import { DeleteUserCtr } from '@/modules/users/app';
import { CreateUser, DeleteUser } from '@/modules/users/context/application';

describe('Delete user controller', () => {
  let controller: DeleteUserCtr;
  let deleteUserService: DeleteUser;
  let createUserService: CreateUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    deleteUserService = module.get<DeleteUser>(DeleteUser);
    createUserService = module.get<CreateUser>(CreateUser);
    controller = module.get<DeleteUserCtr>(DeleteUserCtr);
  });

  it('should be able to delete a user', async () => {
    // Given: Data for a new user to be created
    const mockUser = {
      name: 'John',
      lastName: 'Doe',
      userName: 'johnDoe123',
      email: 'johndoe@mail.com',
      password: 'MyNotT0We@kP@$$Word',
    } as UserPrimitives;

    // Then: Create a new user and store the created user
    const user = await createUserService.run(mockUser);

    // Setup: Spy on the deleteUserService's 'run' method to monitor calls and simulate successful deletion
    const deleteSpy = jest
      .spyOn(deleteUserService, 'run')
      .mockResolvedValue(undefined);

    // When: Execute the controller method to delete the created user
    const result = await controller.run({ id: user.id });

    // Then: Verify that the deleteUserService's 'run' method was called with the correct user ID
    expect(deleteSpy).toBeCalledWith({ id: user.id });

    // And: Verify that the result of the delete operation is undefined, indicating successful deletion
    expect(result).toEqual(undefined);

    // Cleanup: Restore the original implementation of the 'run' method
    deleteSpy.mockRestore();
  });

  it('should throw if user does not exist', async () => {
    // Given: An ID for a user that does not exist
    const userId = { id: 'non-exist-user' };

    // When: Attempting to delete a user with a non-existent ID
    // Then: The operation should throw an error because the user does not exist
    await expect(controller.run(userId)).rejects.toThrow();
  });
});
