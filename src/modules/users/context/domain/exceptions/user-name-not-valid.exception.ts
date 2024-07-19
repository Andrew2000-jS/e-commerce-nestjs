export class UserNameNotValidException extends Error {
  constructor(name: string) {
    super(`User name is not valid: ${name}`);
    this.name = UserNameNotValidException.name;
  }
}
