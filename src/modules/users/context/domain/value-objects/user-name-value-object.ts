import { ValueObject } from '@/modules/shared';

export class UserName extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }
}
