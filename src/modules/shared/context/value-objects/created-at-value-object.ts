import { ValueObject } from './value-object';
import { format } from 'date-fns';

export class CreatedAt extends ValueObject<Date> {
  constructor(value: Date) {
    super(value);
  }

  getFormatDate(): string {
    return format(this.value.toString(), 'yyyy/MM/dd');
  }
}
