import { Criteria, Injectable, Uuid } from '@/modules/shared';
import { User, UserPrimitives, UserRepository } from '../../domain';
import { UserAlreadyExistException } from '../../domain/exceptions';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class CreateUser {
  constructor(private readonly repository: UserRepository) {}

  async run(createUserDto: CreateUserDto): Promise<UserPrimitives> {
    try {
      const criteria = new Criteria({ email: createUserDto.email });
      const isUserExist = await this.repository.match(criteria);

      if (isUserExist) {
        throw new UserAlreadyExistException(createUserDto.email);
      }

      const user = User.create({ ...createUserDto, id: Uuid() });
      await this.repository.create(user);
      return user.toPrimitives();
    } catch (error) {
      if (error instanceof UserAlreadyExistException) {
        throw new UserAlreadyExistException(createUserDto.email);
      }

      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}
