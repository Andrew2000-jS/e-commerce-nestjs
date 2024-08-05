import { Test, TestingModule } from '@nestjs/testing';
import { UserPrimitives, UserRepository } from '@/modules/users/context/domain';
import { UserMockRepository } from '../../../../../__mocks__';
import { UpdateUserCtr } from '@/modules/users/app';
import { CreateUser, UpdateUser } from '@/modules/users/context/application';

describe('Update user controller', () => {
  let controller: UpdateUserCtr;
  let updateUserService: UpdateUser;
  let createUserService: CreateUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateUserCtr],
      providers: [
        UpdateUser,
        CreateUser,
        {
          provide: UserRepository,
          useClass: UserMockRepository,
        },
      ],
    }).compile();

    updateUserService = module.get<UpdateUser>(UpdateUser);
    createUserService = module.get<CreateUser>(CreateUser);
    controller = module.get<UpdateUserCtr>(UpdateUserCtr);
  });

  it('should be able to update a user', async () => {
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
    const userId = { id: user.id };
    const updatedData = {
      name: 'Bill',
      userName: 'Bill5532Doe',
      email: 'bill@mail.com',
    };

    // Setup: Spy on the UpdateUserService's 'run' method to monitor calls and simulate a successful update
    const updateSpy = jest
      .spyOn(updateUserService, 'run')
      .mockResolvedValue({ ...user, ...updatedData });

    // When: Execute the controller method to update the created user with new data
    const result = await controller.run(userId, updatedData);

    // Then: Verify that the UpdateUserService's 'run' method was called with the correct user ID and updated data
    expect(updateSpy).toHaveBeenCalledWith(user.id, updatedData);

    // And: Verify that the result of the update operation matches the updated user data
    expect(result).toEqual({ ...user, ...updatedData });

    // Cleanup: Restore the original implementation of the 'run' method
    updateSpy.mockRestore();
  });

  it('should throw if user does not exist', async () => {
    // Given: A user ID that does not exist in the system
    const userId = { id: 'non-exist' };

    // When: Attempting to update the user with the non-existent ID
    // Then: Expect the controller to throw an error
    await expect(controller.run(userId, { name: 'Bill' })).rejects.toThrow();
  });
});
