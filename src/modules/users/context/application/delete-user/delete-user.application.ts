import { Criteria, Injectable } from '@/modules/shared';
import { UserRepository } from '../../domain';
import { UserNotFoundException } from '../../domain/exceptions';
import { DeleteUserDto } from './delete-user.dto';

@Injectable()
export class DeleteUser {
  constructor(private readonly repository: UserRepository) {}

  async run({ id }: DeleteUserDto): Promise<void> {
    try {
      const criteria = new Criteria({ id });
      const isUserExist = await this.repository.match(criteria);
      if (!isUserExist) {
        throw new UserNotFoundException(id);
      }
      await this.repository.delete(id);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UserNotFoundException(id);
      }
      if (error instanceof Error) throw new Error(error.message);
    }
  }
}
