import { Criteria, Injectable } from '@/modules/shared';
import { UserPrimitives, UserRepository } from '../../domain';
import { UpdateUserDto } from './update-user-dto';
import { UserNotFoundException } from '../../domain/exceptions';
import { UserPassword } from '../../domain/value-objects';

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
      const data = {
        ...updateUserDto,
        updatedAt: new Date(),
      };

      if (updateUserDto.password)
        data.password = new UserPassword(updateUserDto.password).getValue();

      await this.repository.update(id, data);

      return isUserExist[0];
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UserNotFoundException(id);
      }
      if (error instanceof Error) throw new Error(error.message);
    }
  }
}
