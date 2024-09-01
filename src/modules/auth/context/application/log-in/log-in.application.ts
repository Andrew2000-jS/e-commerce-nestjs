import { compare, Criteria, errorHanlder, Injectable } from '@/modules/shared';
import { AuthRepository } from '../../domain';
import {
  AuthIncorrectPasswordException,
  AuthNotFoundException,
} from '../../domain/exceptions';
import { LogInDto } from './log-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LogIn {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async run({ userName, password }: LogInDto): Promise<{ token: string }> {
    try {
      const criteria = new Criteria({ userName });
      const isUserExist = await this.repository.match(criteria);

      if (!isUserExist) {
        throw new AuthNotFoundException();
      }

      if (!compare(password, isUserExist.password)) {
        throw new AuthIncorrectPasswordException();
      }

      const token = await this.jwtService.sign(
        { userId: isUserExist.userId },
        {
          expiresIn: '24h',
        },
      );

      await this.repository.update(isUserExist.userId, {
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
