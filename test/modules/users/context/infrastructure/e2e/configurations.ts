import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

export const mockUser = {
  name: 'Jhon',
  lastName: 'Doe',
  userName: 'jhonDoe123',
  email: 'jhondo@email.com',
  password: 'MyNotT0We@kP@$$Word',
};

export class UserE2EConfigurations {
  private readonly client: PrismaClient;
  private readonly jwtService: JwtService;
  readonly BASE_URL: string = '/users';

  constructor() {
    this.client = new PrismaClient();
    this.jwtService = new JwtService({ secret: process.env.TOKEN_SECRET });
  }

  async cleanDB(): Promise<void> {
    await this.client.users.deleteMany();
  }

  async getToken(): Promise<string> {
    return this.jwtService.sign({ data: 'auth_test_e2e' });
  }
}
