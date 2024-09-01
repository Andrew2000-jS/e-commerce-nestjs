/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthPrimitives, AuthRepository } from '@/modules/auth/context/domain';
import { Criteria, Injectable } from '@/modules/shared';

const mockAuthPrimitive = [
  {
    id: '98765432-1098-7654-3210-987654321098',
    userId: '78554507-9142-4692-840c-442967969f7a',
    userName: 'JhonDoe1123',
    password: 'Abc@12345',
    token: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

@Injectable()
export class AuthMockRepository extends AuthRepository {
  private readonly updateMock: jest.Mock;

  constructor() {
    super();
    this.updateMock = jest.fn();
  }

  async update(id: string, data: Partial<AuthPrimitives>): Promise<void> {
    this.updateMock(id, data);
  }

  async match(criteria: Criteria): Promise<AuthPrimitives | null> {
    const filters = criteria.filters;
    return (
      mockAuthPrimitive.find((auth) => {
        return Object.entries(filters).every(
          ([key, value]) => auth[key] === value,
        );
      }) || null
    );
  }

  assertUpdateHaveBeenCalledWith(id: string, data: Partial<AuthPrimitives>) {
    expect(this.updateMock).toHaveBeenCalledWith(
      id,
      expect.objectContaining({
        token: data.token,
      }),
    );
  }
}
