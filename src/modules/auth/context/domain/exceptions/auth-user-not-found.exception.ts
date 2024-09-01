export class AuthNotFoundException extends Error {
  constructor() {
    super('User not found');
    this.name = AuthNotFoundException.name;
  }
}
