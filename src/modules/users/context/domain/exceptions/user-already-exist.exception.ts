export class UserAlreadyExistException extends Error {
  constructor(email: string) {
    super(`User already exist ${email}`);
    this.name = UserAlreadyExistException.name;
  }
}
