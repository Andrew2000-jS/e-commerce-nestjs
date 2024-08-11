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

  private users: UserPrimitives[] = [];

  constructor() {
    super();
    this.createMock = jest.fn();
    this.updateMock = jest.fn();
    this.deleteMock = jest.fn();
  }

  async create(newUser: User): Promise<void> {
    this.users.push(newUser.toPrimitives());
    this.createMock(newUser);
  }

  async update(id: string, data: UserWithoutMetadata): Promise<void> {
    this.updateMock(id, data);
  }

  async delete(id: string): Promise<void> {
    this.deleteMock(id);
  }

  async match(criteria: Criteria): Promise<UserPrimitives | null> {
    const criteriaFilters = criteria.filters;
    return (
      this.users.find((user) => {
        return Object.entries(criteriaFilters).every(
          ([key, value]) => user[key] === value,
        );
      }) || null
    );
  }

  assertUpdateHaveBeenCalledWith(id: string, data: Partial<UserPrimitives>) {
    expect(this.updateMock).toHaveBeenCalledWith(
      id,
      expect.objectContaining({
        email: data.email,
      }),
    );
  }

  assertDeleteHaveBeenCalledWith(id: string) {
    expect(this.deleteMock).toHaveBeenCalledWith(id);
  }

  assertCreateHaveBeenCalledWith(user: User) {
    const userPrimitives = user.toPrimitives();
    expect(this.createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: new UserFullName(userPrimitives.name),
        lastName: new UserFullName(userPrimitives.lastName),
        email: new UserEmail(userPrimitives.email),
        userName: new UserName(userPrimitives.userName),
      }),
    );
  }
}
