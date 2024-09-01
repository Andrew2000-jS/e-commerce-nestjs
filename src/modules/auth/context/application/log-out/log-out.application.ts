import { Criteria, errorHanlder, Injectable } from '@/modules/shared';
import { AuthRepository } from '../../domain';
import { AuthNotFoundException } from '../../domain/exceptions';

@Injectable()
export class LogOut {
  constructor(private readonly repository: AuthRepository) {}

  async run(id: string): Promise<void> {
    try {
      const criteria = new Criteria({ userId: id });
      const isUserExist = await this.repository.match(criteria);

      if (!isUserExist) {
        throw new AuthNotFoundException();
      }

      await this.repository.update(id, { token: null });
    } catch (error) {
      errorHanlder(error, [AuthNotFoundException]);
    }
  }
}
