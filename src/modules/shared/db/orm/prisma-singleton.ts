import { PrismaClient } from '@prisma/client';

export class PrismaSingleton {
  private static instance: PrismaClient;

  private constructor() {}

  static getInstance(adapter: any): PrismaClient {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaClient({ adapter });
    }

    return PrismaSingleton.instance;
  }
}
