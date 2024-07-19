import { ValueObject } from 'src/modules/shared';
import { UserNameNotValidException } from '../exceptions';

export class UserFullName extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureUserNameIsValid(value);
  }

  private ensureUserNameIsValid(value: string): void {
    const hasNumbers = /.*\d.*/;
    const specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
    const condition =
      value.length > 30 ||
      value.length < 3 ||
      specialChars.test(value) ||
      hasNumbers.test(value);

    if (condition) {
      throw new UserNameNotValidException(value);
    }
  }
}
