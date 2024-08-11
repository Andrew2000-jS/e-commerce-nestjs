export class UserNameNotValidException extends Error {
  constructor() {
    super('User name is not valid');
    this.name = UserNameNotValidException.name;
  }
}
