import { UserPrimitives } from '@/modules/users/context/domain';
import { UpdateUserCtr } from '@/modules/users/app';
import { CreateUser, UpdateUser } from '@/modules/users/context/application';
import { testingModule } from './update-testing-module';
import { AuthGuard } from '@/modules/shared';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('Update user controller', () => {
  let controller: UpdateUserCtr;
  let updateUserService: UpdateUser;
  let createUserService: CreateUser;
  let guard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await testingModule();

    updateUserService = module.get<UpdateUser>(UpdateUser);
    createUserService = module.get<CreateUser>(CreateUser);
    controller = module.get<UpdateUserCtr>(UpdateUserCtr);
    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = new JwtService({ secret: 'test_secret' });
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

  it('should throw if user has not access', async () => {
    // Given: An invalid authorization header

    // Then: Execution ctx for guard
    const executionCtx = {
      switchToHttp: () => ({
        getRequest: () => ({ token: null }),
      }),
    } as ExecutionContext;

    // Attempting to send an invalid authorization header
    // Then: expect the guard to throw an error
    expect(guard.canActivate(executionCtx)).rejects.toThrow();
  });

  it('should be able to update if user has valid token', async () => {
    // Given: A valid authorization header
    const token = await jwtService.sign('Test');

    // Then: Execution ctx for guard
    const executionCtx = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: `Bearer ${token}` } }),
      }),
    } as ExecutionContext;

    // Attempting to send an authorization header
    // Then: expect the guard resolve the request and allow user to continue
    expect(guard.canActivate(executionCtx)).resolves.toBe(true);
  });
});
