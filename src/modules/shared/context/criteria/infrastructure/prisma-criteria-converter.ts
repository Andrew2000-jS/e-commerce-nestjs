import { Criteria } from '../domain';

interface IConverter {
  where: any;
  orderBy: any;
  take?: number;
  skip?: number;
}

export class CriteriaPrismaConverter {
  static convert(criteria: Criteria): IConverter {
    const prismaFilters: any = {};

    for (const [key, value] of Object.entries(criteria.filters)) {
      prismaFilters[key] = value;
    }

    const prismaOrders = criteria.orders.map((order) => ({
      [order.field]: order.direction.toLowerCase(),
    }));

    return {
      where: prismaFilters,
      orderBy: prismaOrders,
      take: criteria.limit,
      skip: criteria.offset,
    };
  }
}
