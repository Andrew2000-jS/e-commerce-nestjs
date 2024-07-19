import {
  Criteria,
  CriteriaPrismaConverter,
  PrismaSingleton,
} from 'src/modules/shared';
import {
  User,
  UserPrimitives,
  UserRepository,
  UserWithoutMetadata,
} from '../../../domain';
import { configurations } from 'src/modules/shared/db/orm/configuration';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostgresqlUserRepository extends UserRepository {
  async create(newUser: User): Promise<void> {
    const prisma = PrismaSingleton.getInstance(configurations);
    const userPrimitives = newUser.toPrimitives();
    try {
      await prisma.user.create({
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
        console.log(error.message);
        throw new Error(error.message);
      }
    } finally {
      await prisma.$disconnect();
    }
  }

  async update(id: string, data: UserWithoutMetadata): Promise<void> {
    const prisma = PrismaSingleton.getInstance(configurations);
    try {
      await prisma.user.update({
        where: { id },
        data: this.userFromPrimitivesMapper(data),
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        throw new Error(error.message);
      }
    } finally {
      await prisma.$disconnect();
    }
  }

  async delete(id: string): Promise<void> {
    const prisma = PrismaSingleton.getInstance(configurations);
    try {
      await prisma.user.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        throw new Error(error.message);
      }
    } finally {
      await prisma.$disconnect();
    }
  }

  async match(criteria: Criteria): Promise<UserPrimitives | null> {
    const prisma = PrismaSingleton.getInstance(configurations);
    const prismaConvert = CriteriaPrismaConverter.convert(criteria);
    try {
      const user = await prisma.user.findMany({ ...prismaConvert });
      if (user.length < 1) {
        return null;
      }
      return this.userPrimitivesMapper(user[0]);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
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
