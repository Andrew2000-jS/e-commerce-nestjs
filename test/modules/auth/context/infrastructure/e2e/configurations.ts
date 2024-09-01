import { hash, Uuid } from '@/modules/shared';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

export const mockUser = {
  id: Uuid(),
  name: 'Bill',
  last_name: 'Doe',
  user_name: 'BillDoe2233',
  email: 'BillDoe@email.com',
  password: hash('Abc@12345'),
};

export class AuthE2EConfigurations {
  private readonly jwtService: JwtService;
  private readonly client: PrismaClient;
  readonly BASE_URL: string = '/auth';

  constructor() {
    this.client = new PrismaClient();
    this.jwtService = new JwtService({ secret: process.env.TOKEN_SECRET });
  }

  async seedDBWithMockUser(): Promise<void> {
    const user = await this.client.users.create({
      data: { ...mockUser },
    });

    await this.client.auth.create({
      data: {
        user_name: user.user_name,
        password: user.password,
        user_id: user.id,
      },
    });
  }

  async cleanDB(): Promise<void> {
    await this.client.users.deleteMany();
  }

  async getToken(): Promise<string> {
    return this.jwtService.sign({ data: 'auth_test_e2e' });
  }
}
