import { UserPrimitives } from '@/modules/users/context/domain';
import { MatchUserCtr } from '@/modules/users/app';
import { CreateUser, MatchUser } from '@/modules/users/context/application';
import { Criteria } from '@/modules/shared';
import { testingModule } from './match-testing-module';

describe('Match user controller', () => {
  let controller: MatchUserCtr;
  let matchUserService: MatchUser;
  let createUserService: CreateUser;

  beforeEach(async () => {
    const module = await testingModule();

    matchUserService = module.get<MatchUser>(MatchUser);
    createUserService = module.get<CreateUser>(CreateUser);
    controller = module.get<MatchUserCtr>(MatchUserCtr);
  });

  it('should be able to match a user', async () => {
    // Given: Data for the new user to be created
    const mockUser = {
      name: 'Jhon',
      lastName: 'Doe',
      userName: 'jhonDoe123',
      email: 'jhondoe@mail.com',
      password: 'MyNotT0We@kP@$$Word',
    } as UserPrimitives;

    // Then: Create a new user
    const user = await createUserService.run(mockUser);
    const criteria = new Criteria({ id: user.id });

    // Setup: Spy on the matchUserService's 'run' method to monitor calls and return a resolved promise with found user
    const matchSpy = jest
      .spyOn(matchUserService, 'run')
      .mockResolvedValue(user);

    // When: Execute the controller method to match the created user
    const result = await controller.run(criteria);

    // Then: Verify that the matchUserService's 'run' method was called with the correct user ID
    expect(matchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: expect.objectContaining({ filters: { id: user.id } }),
      }),
    );

    // And: Verify that the result of the match operation is the correct user
    expect(result).toEqual(user);

    // Cleanup: Restore the original implementation of the 'run' method
    matchSpy.mockRestore();
  });
});
