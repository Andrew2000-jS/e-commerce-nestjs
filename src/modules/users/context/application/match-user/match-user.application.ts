import { Criteria, Injectable } from '@/modules/shared';
import { UserPrimitives, UserRepository } from '../../domain';

@Injectable()
export class MatchUser {
  constructor(private readonly repository: UserRepository) {}

  async run(criteria: Criteria): Promise<UserPrimitives | null> {
    try {
      const foundUser = await this.repository.match(criteria);
      return foundUser;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }
}
