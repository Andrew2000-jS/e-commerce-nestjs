import { Criteria, Injectable } from '@/modules/shared';
import { AuthPrimitives, AuthRepository } from '../../domain';

@Injectable()
export class MatchUser {
  constructor(private readonly repository: AuthRepository) {}

  async run(criteria: Criteria): Promise<AuthPrimitives | null> {
    try {
      const foundUser = await this.repository.match(criteria);
      return foundUser;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }
}
