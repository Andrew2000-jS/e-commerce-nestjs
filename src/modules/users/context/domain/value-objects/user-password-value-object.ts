import { hash } from '@/modules/shared';
import { UserPasswordNotValidException } from '../exceptions';

export class UserPassword {
  private value: string;

  constructor(value: string) {
    this.ensurePasswordIsValid(value);
    this.value = this.hashPassword(value);
  }

  private hashPassword(value: string): string {
    return hash(value);
  }

  getValue(): string {
    return this.value;
  }

  private ensurePasswordIsValid(value: string): void {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const specialCharRegex = /[!@$#\-_%^&*()+=[\]{};':"\\|,.<>/?~`]/;

    if (
      !uppercaseRegex.test(value) ||
      !lowercaseRegex.test(value) ||
      !digitRegex.test(value) ||
      !specialCharRegex.test(value) ||
      value.length < 8
    ) {
      throw new UserPasswordNotValidException(value);
    }
  }
}
