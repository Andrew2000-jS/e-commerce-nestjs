import { PrismaClient } from '@prisma/client';

export class PrismaSingleton {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(configurations: unknown): PrismaClient {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaClient(configurations);
    }

    return PrismaSingleton.instance;
  }
}
