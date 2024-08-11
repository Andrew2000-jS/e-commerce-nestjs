import { Criteria } from '@/modules/shared';
import { User, UserPrimitives, UserWithoutMetadata } from './user.entity';
export abstract class UserRepository {
  abstract create(newUser: User): Promise<void>;
  abstract update(id: string, data: UserWithoutMetadata): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract match(criteria: Criteria): Promise<UserPrimitives | null>;
}
