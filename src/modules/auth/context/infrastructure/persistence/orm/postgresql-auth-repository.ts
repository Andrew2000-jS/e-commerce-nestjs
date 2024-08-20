import { Injectable } from '@nestjs/common';
import { AuthPrimitives, AuthRepository } from '../../../domain';
import {
  Criteria,
  CriteriaPrismaConverter,
  PrismaSingleton,
} from '@/modules/shared';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { NODE_ENV, DB_URL_DEV, DB_TEST_URL } = process.env;

process.env.DATABASE_URL = NODE_ENV === 'test' ? DB_TEST_URL : DB_URL_DEV;

const pool = new Pool({
  connectionString: NODE_ENV === 'test' ? DB_TEST_URL : DB_URL_DEV,
});

const adapter = new PrismaPg(pool);

@Injectable()
export class PostgresqlAuthRepository extends AuthRepository {
  async update(id: string, data: Partial<AuthPrimitives>): Promise<void> {
    const prisma = PrismaSingleton.getInstance(adapter);
    try {
      await prisma.auth.update({
        where: { id },
        data: this.authFromPrimitivesMapper(data),
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    } finally {
      await prisma.$disconnect();
    }
  }

  async match(criteria: Criteria): Promise<AuthPrimitives | null> {
    const prisma = PrismaSingleton.getInstance(adapter);
    const prismaConvert = CriteriaPrismaConverter.convert(criteria);
    try {
      const auth = await prisma.auth.findMany({ ...prismaConvert });
      if (auth.length < 1) {
        return null;
      }
      return this.authPrimitivesMapper(auth[0]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    } finally {
      await prisma.$disconnect();
    }
  }

  private authPrimitivesMapper(user: any): AuthPrimitives {
    return {
      id: user.id,
      userId: user.user_id,
      userName: user.user_name,
      password: user.password,
      token: user.token,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private authFromPrimitivesMapper(user: any): any {
    return {
      id: user.id,
      user_id: user.userId,
      user_name: user.userName,
      password: user.password,
      token: user.token,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
