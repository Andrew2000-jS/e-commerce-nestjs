/* eslint-disable @typescript-eslint/no-unused-vars */
import { Criteria, Injectable } from '@/modules/shared';
import {
  User,
  UserPrimitives,
  UserRepository,
  UserWithoutMetadata,
} from '@/modules/users/context/domain';
import {
  UserEmail,
  UserFullName,
  UserName,
} from '@/modules/users/context/domain/value-objects';

@Injectable()
export class UserMockRepository extends UserRepository {
  private createMock: jest.Mock;
  private updateMock: jest.Mock;
  private deleteMock: jest.Mock;
  private matchMock: jest.Mock;

  private users: UserPrimitives;

  constructor() {
    super();
    this.createMock = jest.fn();
    this.updateMock = jest.fn();
    this.deleteMock = jest.fn();
    this.matchMock = jest.fn();
  }

  async create(newUser: User): Promise<void> {
    this.createMock(newUser);
  }

  async update(id: string, data: UserWithoutMetadata): Promise<void> {
    this.updateMock(id, data);
  }

  async delete(id: string): Promise<void> {
    this.deleteMock(id);
  }

  async match(_criteria: Criteria): Promise<UserPrimitives | null> {
    return this.users;
  }

  assertCreateHaveBeenCalledWith(user: User) {
    const userPrimitives = user.toPrimitives();
    expect(this.createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: new UserFullName(userPrimitives.name),
        lastName: new UserFullName(userPrimitives.lastName),
        email: new UserEmail('jhondoe@mail.com'),
        userName: new UserName(userPrimitives.userName),
      }),
    );
  }
}
