import { Test, TestingModule } from '@nestjs/testing';
import { UserPrimitives, UserRepository } from '@/modules/users/context/domain';
import { UserMockRepository } from '../../../../../__mocks__';
import { CreateUserCtr } from '@/modules/users/app';
import { CreateUser } from '@/modules/users/context/application';

describe('Create user controller', () => {
  let controller: CreateUserCtr;
  let service: CreateUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateUserCtr],
      providers: [
        CreateUser,
        {
          provide: UserRepository,
          useClass: UserMockRepository,
        },
      ],
    }).compile();

    service = module.get<CreateUser>(CreateUser);
    controller = module.get<CreateUserCtr>(CreateUserCtr);
  });

  it('should be able to create a new user', async () => {
    // Given: Data for the new user to be created
    const mockUser = {
      name: 'Jhon',
      lastName: 'Doe',
      userName: 'jhonDoe123',
      email: 'jhondoe@mail.com',
      password: 'MyNotT0We@kP@$$Word',
    } as UserPrimitives;

    // Setup: Spy on the 'run' method of the service to monitor calls and return a resolved promise with mockUser
    const spy = jest.spyOn(service, 'run');
    spy.mockResolvedValue(mockUser);

    // When: Execute the controller method to run the creation of the new user
    const result = await controller.run(mockUser);

    // Then: Verify that the service's 'run' method was called with the correct data
    expect(spy).toHaveBeenCalledWith(mockUser);

    // And: Verify that the result returned from the controller matches the mockUser data
    expect(result).toEqual(mockUser);

    // Cleanup: Restore the original implementation of the 'run' method
    spy.mockRestore();
  });

  it('should throw if user has invalid data', async () => {
    // Given: Data for the new user with invalid name format
    const mockUser = {
      name: 'Jhon45',
      lastName: 'Doe',
      userName: 'jhonDoe123',
      email: 'jhondoee@mail.com',
      password: 'MyNotT0We@kP@$$Word',
    } as UserPrimitives;

    // When & Then: Attempting to create a user with invalid data should throw an error
    await expect(controller.run(mockUser)).rejects.toThrow();
  });
});
