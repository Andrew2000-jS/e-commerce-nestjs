import { Criteria, Injectable } from 'src/modules/shared';
import { UserPrimitives, UserRepository } from '../../domain';
import { UpdateUserDto } from './update-user-dto';
import { UserNotFoundException } from '../../domain/exceptions';

@Injectable()
export class UpdateUser {
  constructor(private readonly repository: UserRepository) {}

  async run(id: string, updateUserDto: UpdateUserDto): Promise<UserPrimitives> {
    try {
      const criteria = new Criteria({ id });
      const isUserExist = await this.repository.match(criteria);

      if (!isUserExist) {
        throw new UserNotFoundException(id);
      }

      await this.repository.update(id, {
        ...updateUserDto,
        updatedAt: new Date(),
      });

      return isUserExist[0];
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        console.log(error.message);
        throw new UserNotFoundException(id);
      }
      if (error instanceof Error) throw new Error(error.message);
    }
  }
}
