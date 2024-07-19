import * as validate from 'uuid-validate';
import { ValueObject } from './value-object';
import { InvalidUuidException } from '../exceptions';

export class UuidValueObject extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureIsValidUuid(value);
  }

  private ensureIsValidUuid(id: string): void {
    if (!validate(id)) {
      throw new InvalidUuidException();
    }
  }
}
