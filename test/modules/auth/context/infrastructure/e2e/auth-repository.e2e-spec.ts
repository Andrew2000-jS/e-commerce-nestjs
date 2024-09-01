import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { testModule, usePipes } from '../../../../shared';
import { TestingModule } from '@nestjs/testing';
import { mockUser, AuthE2EConfigurations } from './configurations';

const configuration = new AuthE2EConfigurations();

describe('Auth End-to-End tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await testModule.compile();

    app = moduleFixture.createNestApplication();
    usePipes(app);
    await app.init();
  });

  describe('Happy path', () => {
    beforeEach(async () => {
      await configuration.seedDBWithMockUser();
    });

    it('should login', async () => {
      const { statusCode, body } = await request(app.getHttpServer())
        .post(`${configuration.BASE_URL}/login`)
        .send({ userName: 'BillDoe2233', password: 'Abc@12345' });

      expect(statusCode).toEqual(200);
      expect(body.token).not.toEqual(null);
    });

    it('should logout', async () => {
      const token = await configuration.getToken();
      const { statusCode } = await request(app.getHttpServer())
        .post(`${configuration.BASE_URL}/logout/${mockUser.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(statusCode).toEqual(200);
    });

    afterEach(async () => {
      await configuration.cleanDB();
    });
  });

  describe('Not happy path', () => {
    it('should throw if user has not a token', async () => {
      await configuration.seedDBWithMockUser();

      const { statusCode } = await request(app.getHttpServer()).post(
        `${configuration.BASE_URL}/logout/${mockUser.id}`,
      );

      expect(statusCode).toEqual(401);
      await configuration.cleanDB();
    });

    it('should throw if user does not exist', async () => {
      const token = await configuration.getToken();
      const { statusCode } = await request(app.getHttpServer())
        .post(`${configuration.BASE_URL}/logout/${mockUser.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(statusCode).toEqual(404);
    });
  });

  afterAll(async () => {
    await configuration.cleanDB();
    await app.close();
  });
});
