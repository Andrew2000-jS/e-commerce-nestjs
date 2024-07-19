export class UserEmailNotValidException extends Error {
  constructor(email: string) {
    super(`This email is not valid: ${email}`);
    this.name = UserEmailNotValidException.name;
  }
}
