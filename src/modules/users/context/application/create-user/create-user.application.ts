import { Criteria, errorHanlder, Injectable, Uuid } from '@/modules/shared';
import { User, UserPrimitives, UserRepository } from '../../domain';
import {
  UserAlreadyExistException,
  UserEmailNotValidException,
  UserNameNotValidException,
  UserPasswordNotValidException,
} from '../../domain/exceptions';
import { CreateUserDto } from './create-user.dto';

const errorTypes = [
  UserAlreadyExistException,
  UserEmailNotValidException,
  UserNameNotValidException,
  UserPasswordNotValidException,
];

@Injectable()
export class CreateUser {
  constructor(private readonly repository: UserRepository) {}

  async run(createUserDto: CreateUserDto): Promise<UserPrimitives> {
    try {
      const criteria = new Criteria({ email: createUserDto.email });
      const isUserExist = await this.repository.match(criteria);

      if (isUserExist) {
        throw new UserAlreadyExistException();
      }

      const user = User.create({ ...createUserDto, id: Uuid() });
      await this.repository.create(user);
      return user.toPrimitives();
    } catch (error) {
      errorHanlder(error, errorTypes);
    }
  }
}
