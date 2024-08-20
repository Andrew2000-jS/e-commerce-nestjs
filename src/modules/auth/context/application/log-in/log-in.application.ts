import { compare, Criteria, errorHanlder, Injectable } from '@/modules/shared';
import { AuthRepository } from '../../domain';
import { generateToken } from '../../utils';
import {
  AuthIncorrectPasswordException,
  AuthNotFoundException,
} from '../../domain/exceptions';
import { LogInDto } from './log-in.dto';

@Injectable()
export class LogIn {
  constructor(private readonly repository: AuthRepository) {}

  async run({ user_name, password }: LogInDto): Promise<{ token: string }> {
    try {
      const criteria = new Criteria({ user_name });
      const isUserExist = await this.repository.match(criteria);

      if (!isUserExist) {
        throw new AuthNotFoundException();
      }

      if (!compare(password, isUserExist.password)) {
        throw new AuthIncorrectPasswordException();
      }

      const token = generateToken(
        { userId: isUserExist.userId },
        process.env.TOKEN_SECRET,
        '24h',
      );

      await this.repository.update(isUserExist.id, {
        token,
        updatedAt: new Date(),
      });

      return { token };
    } catch (error) {
      errorHanlder(error, [
        AuthIncorrectPasswordException,
        AuthNotFoundException,
      ]);
    }
  }
}
