import { CreatedAt, UpdatedAt } from '@/modules/shared';
import {
  UserEmail,
  UserFullName,
  UserId,
  UserName,
  UserPassword,
} from './value-objects';

export interface UserPrimitives {
  id: string;
  name: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserWithoutMetadata = Omit<
  User,
  'id' | 'createdAt' | 'toPrimitives'
>;

export class User {
  private readonly id: UserId;
  private readonly name: UserFullName;
  private readonly lastName: UserFullName;
  private readonly email: UserEmail;
  private readonly userName: UserName;
  private readonly password: UserPassword;
  private readonly createdAt: CreatedAt;
  private readonly updatedAt: UpdatedAt;

  constructor(
    id: UserId,
    name: UserFullName,
    lastName: UserFullName,
    email: UserEmail,
    userName: UserName,
    password: UserPassword,
    createdAt: CreatedAt,
    updatedAt: UpdatedAt,
  ) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.userName = userName;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(plainData: {
    id: string;
    name: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
  }): User {
    return new User(
      new UserId(plainData.id),
      new UserFullName(plainData.name),
      new UserFullName(plainData.lastName),
      new UserEmail(plainData.email),
      new UserName(plainData.userName),
      new UserPassword(plainData.password),
      new CreatedAt(new Date()),
      new UpdatedAt(new Date()),
    );
  }

  toPrimitives(): UserPrimitives {
    return {
      id: this.id.getValue(),
      name: this.name.getValue(),
      lastName: this.lastName.getValue(),
      email: this.email.getValue(),
      userName: this.userName.getValue(),
      password: this.password.getValue(),
      createdAt: this.createdAt.getValue(),
      updatedAt: this.updatedAt.getValue(),
    };
  }

  static fromPrimitives(plainData: UserPrimitives): User {
    return new User(
      new UserId(plainData.id),
      new UserFullName(plainData.name),
      new UserFullName(plainData.lastName),
      new UserEmail(plainData.email),
      new UserName(plainData.userName),
      new UserPassword(plainData.password),
      new CreatedAt(new Date()),
      new UpdatedAt(new Date()),
    );
  }

  static fromPartialPrimitives(
    partialData: Partial<UserPrimitives>,
    currentData: UserPrimitives,
  ): User {
    return new User(
      new UserId(partialData.id ?? currentData.id),
      new UserFullName(partialData.name ?? currentData.name),
      new UserFullName(partialData.lastName ?? currentData.lastName),
      new UserEmail(partialData.email ?? currentData.email),
      new UserName(partialData.userName ?? currentData.userName),
      new UserPassword(partialData.password ?? currentData.password),
      new CreatedAt(partialData.createdAt ?? currentData.createdAt),
      new UpdatedAt(new Date()),
    );
  }
}
