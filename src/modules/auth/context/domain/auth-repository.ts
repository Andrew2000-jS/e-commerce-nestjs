import { Criteria } from '@/modules/shared';
import { AuthPrimitives } from './auth.entity';

export abstract class AuthRepository {
  abstract update(id: string, data: Partial<AuthPrimitives>): Promise<void>;
  abstract match(criteria: Criteria): Promise<AuthPrimitives | null>;
}
