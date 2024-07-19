import { ValueObject } from 'src/modules/shared';

export class UserName extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }
}
