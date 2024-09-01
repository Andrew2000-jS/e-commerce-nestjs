export class AuthIncorrectPasswordException extends Error {
  constructor() {
    super('Password is in correct!');
    this.name = AuthIncorrectPasswordException.name;
  }
}
