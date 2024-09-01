export interface AuthPrimitives {
  id: string;
  userId: string;
  userName: string;
  password: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Auth {
  private readonly id: string;
  private readonly userId: string;
  private readonly userName: string;
  private readonly password: string;
  private readonly token: string;
  private readonly createdAt: Date;
  private readonly updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    userName: string,
    password: string,
    token: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.userName = userName;
    this.password = password;
    this.token = token;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(plainData: {
    id: string;
    userId: string;
    userName: string;
    password: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
  }): Auth {
    return new Auth(
      plainData.id,
      plainData.userId,
      plainData.userName,
      plainData.password,
      plainData.token,
      plainData.createdAt,
      plainData.updatedAt,
    );
  }

  toPrimitives(): AuthPrimitives {
    return {
      id: this.id,
      userId: this.userId,
      userName: this.userName,
      password: this.password,
      token: this.token,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  fromPrimitives(plainData: AuthPrimitives): Auth {
    return new Auth(
      plainData.id,
      plainData.userId,
      plainData.userName,
      plainData.password,
      plainData.token,
      plainData.createdAt,
      plainData.updatedAt,
    );
  }
}
