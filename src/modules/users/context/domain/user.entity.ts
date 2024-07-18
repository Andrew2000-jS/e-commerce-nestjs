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

export class User {
  private readonly id: string;
  private readonly name: string;
  private readonly lastName: string;
  private readonly email: string;
  private readonly userName: string;
  private readonly password: string;
  private readonly createdAt: Date;
  private readonly updatedAt: Date;

  constructor(userPrimitives: UserPrimitives) {
    this.id = userPrimitives.id;
    this.name = userPrimitives.name;
    this.lastName = userPrimitives.lastName;
    this.email = userPrimitives.email;
    this.userName = userPrimitives.userName;
    this.password = userPrimitives.password;
    this.createdAt = userPrimitives.createdAt;
    this.updatedAt = userPrimitives.updatedAt;
  }

  static create(plainData: {
    id: string;
    name: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
  }): User {
    return new User({
      id: plainData.id,
      name: plainData.name,
      lastName: plainData.lastName,
      email: plainData.email,
      userName: plainData.userName,
      password: plainData.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  toPrimitives(): UserPrimitives {
    return {
      id: this.id,
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      userName: this.userName,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromPrimitives(plainData: UserPrimitives): User {
    return new User({
      id: plainData.id,
      name: plainData.name,
      lastName: plainData.lastName,
      email: plainData.email,
      userName: plainData.userName,
      password: plainData.password,
      createdAt: plainData.createdAt,
      updatedAt: plainData.updatedAt,
    });
  }
}
