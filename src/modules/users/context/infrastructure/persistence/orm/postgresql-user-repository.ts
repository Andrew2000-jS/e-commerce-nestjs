import {
  Criteria,
  CriteriaPrismaConverter,
  PrismaSingleton,
} from '@/modules/shared';
import {
  User,
  UserPrimitives,
  UserRepository,
  UserWithoutMetadata,
} from '../../../domain';
import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { NODE_ENV, DB_URL_DEV, DB_TEST_URL } = process.env;

process.env.DATABASE_URL = NODE_ENV === 'test' ? DB_TEST_URL : DB_URL_DEV;

const pool = new Pool({
  connectionString: NODE_ENV === 'test' ? DB_TEST_URL : DB_URL_DEV,
});

const adapter = new PrismaPg(pool);

@Injectable()
export class PostgresqlUserRepository extends UserRepository {
  async create(newUser: User): Promise<void> {
    const prisma = PrismaSingleton.getInstance(adapter);
    const userPrimitives = newUser.toPrimitives();
    try {
      await prisma.users.create({
        data: {
          id: userPrimitives.id,
          name: userPrimitives.name,
          last_name: userPrimitives.lastName,
          email: userPrimitives.email,
          user_name: userPrimitives.userName,
          password: userPrimitives.password,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    } finally {
      await prisma.$disconnect();
    }
  }

  async update(id: string, data: UserWithoutMetadata): Promise<void> {
    const prisma = PrismaSingleton.getInstance(adapter);
    try {
      await prisma.users.update({
        where: { id },
        data: this.userFromPrimitivesMapper(data),
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    } finally {
      await prisma.$disconnect();
    }
  }

  async delete(id: string): Promise<void> {
    const prisma = PrismaSingleton.getInstance(adapter);
    try {
      await prisma.users.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    } finally {
      await prisma.$disconnect();
    }
  }

  async match(criteria: Criteria): Promise<UserPrimitives | null> {
    const prisma = PrismaSingleton.getInstance(adapter);
    const prismaConvert = CriteriaPrismaConverter.convert(criteria);
    try {
      const user = await prisma.users.findMany({ ...prismaConvert });
      if (user.length < 1) {
        return null;
      }
      return this.userPrimitivesMapper(user[0]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    } finally {
      await prisma.$disconnect();
    }
  }

  private userPrimitivesMapper(user: any): UserPrimitives {
    return {
      id: user.id,
      name: user.name,
      lastName: user.last_name,
      email: user.email,
      userName: user.user_name,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private userFromPrimitivesMapper(user: any): any {
    return {
      name: user.name,
      last_name: user.lastName,
      email: user.email,
      user_name: user.userName,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
