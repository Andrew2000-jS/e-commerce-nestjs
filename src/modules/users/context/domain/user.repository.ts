import { Criteria } from 'src/modules/shared';
import { User, UserPrimitives } from './user.entity';

export abstract class UserRepository {
  abstract create(newUser: User): Promise<void>;
  abstract update(
    id: string,
    data: Omit<User, 'id' | 'createdAt' | 'toPrimitives'>,
  ): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract match(criteria: Criteria): Promise<UserPrimitives | null>;
}
