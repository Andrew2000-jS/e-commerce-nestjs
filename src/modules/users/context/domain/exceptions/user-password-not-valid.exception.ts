export class UserPasswordNotValidException extends Error {
  constructor(password: string) {
    super(`This Password is not valid: ${password}`);
    this.name = UserPasswordNotValidException.name;
  }
}
