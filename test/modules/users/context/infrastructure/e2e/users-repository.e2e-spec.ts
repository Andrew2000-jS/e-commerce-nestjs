import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { testModule, usePipes } from '../../../../shared';
import { mockUser, UserE2EConfigurations } from './configurations';

const configuration = new UserE2EConfigurations();

describe('User End-to-End Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await testModule.compile();
    app = moduleFixture.createNestApplication();
    usePipes(app);
    await app.init();
  });

  describe('Happy path', () => {
    beforeEach(async () => {
      await configuration.cleanDB();
    });

    it('should create a new user', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post(`${configuration.BASE_URL}/register`)
        .send(mockUser);

      expect(statusCode).toEqual(201);

      expect(body).toHaveProperty('userName', mockUser.userName);
      expect(body).toHaveProperty('email', mockUser.email);
    });

    it('should update a user', async () => {
      const token = await configuration.getToken();

      const { body: createUserBody } = await request(app.getHttpServer())
        .post(`${configuration.BASE_URL}/register`)
        .send(mockUser);

      const { statusCode } = await request(app.getHttpServer())
        .patch(`${configuration.BASE_URL}/update/${createUserBody.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Bill',
          userName: 'BillDoe432',
          email: 'bill@mail.com',
        });

      const { body } = await request(app.getHttpServer())
        .post(`${configuration.BASE_URL}/match`)
        .send({ id: createUserBody.id });

      expect(statusCode).toEqual(200);

      expect(body).toHaveProperty('name', 'Bill');
      expect(body).toHaveProperty('userName', 'BillDoe432');
      expect(body).toHaveProperty('email', 'bill@mail.com');
    });

    it('should delete a user', async () => {
      const token = await configuration.getToken();
      const { body: createUserBody } = await request(app.getHttpServer())
        .post(`${configuration.BASE_URL}/register`)
        .send(mockUser);

      const { statusCode } = await request(app.getHttpServer())
        .delete(`${configuration.BASE_URL}/delete/${createUserBody.id}`)
        .set('Authorization', `Bearer ${token}`);

      const { body } = await request(app.getHttpServer())
        .post(`${configuration.BASE_URL}/match`)
        .send({ id: createUserBody.id });

      expect(statusCode).toEqual(204);

      expect(body).not.toHaveProperty('name', body.name);
      expect(body).not.toHaveProperty('lastName', body.lastName);
      expect(body).not.toHaveProperty('email', body.email);
      expect(body).not.toHaveProperty('userName', body.userName);
      expect(body).not.toHaveProperty('password', body.password);
    });

    afterEach(async () => {
      await configuration.cleanDB();
    });
  });

  describe('Not happy path', () => {
    beforeEach(async () => {
      await configuration.cleanDB();
    });

    it('should throw an error if the user already exists', async () => {
      await request(app.getHttpServer())
        .post(`${configuration.BASE_URL}/register`)
        .send(mockUser);

      const { body, statusCode } = await request(app.getHttpServer())
        .post(`${configuration.BASE_URL}/register`)
        .send(mockUser);

      expect(statusCode).toEqual(400);

      expect(body).toHaveProperty('message', 'User already exist');
      expect(body).toHaveProperty('error', 'Bad Request');
    });

    it('should throw an error if the user has invalid characters', async () => {
      mockUser.name = 'Bill5'; // Invalid Name
      mockUser.userName = 'NewUser';
      mockUser.email = 'bill@mail.com';

      const { body, statusCode } = await request(app.getHttpServer())
        .post(`${configuration.BASE_URL}/register`)
        .send(mockUser);

      expect(statusCode).toEqual(400);

      expect(body).toHaveProperty('message', 'User name is not valid');
      expect(body).toHaveProperty('error', 'Bad Request');
    });

    it('should throw an error if the user does not exist when trying to update', async () => {
      const token = await configuration.getToken();

      const { body, statusCode } = await request(app.getHttpServer())
        .patch(`${configuration.BASE_URL}/update/non-exist-user`)
        .set('Authorization', `Bearer ${token}`)
        .send(mockUser);

      expect(statusCode).toEqual(404);

      expect(body).toHaveProperty('message', 'User not found');
      expect(body).toHaveProperty('error', 'Not Found');
    });

    it('should throw an error if the user does not exist when trying to delete', async () => {
      const token = await configuration.getToken();
      const { body, statusCode } = await request(app.getHttpServer())
        .delete(`${configuration.BASE_URL}/delete/non-exist-user`)
        .set('Authorization', `Bearer ${token}`);

      expect(statusCode).toEqual(404);

      expect(body).toHaveProperty('message', 'User not found');
      expect(body).toHaveProperty('error', 'Not Found');
    });

    afterEach(async () => {
      await configuration.cleanDB();
    });
  });

  afterAll(async () => {
    await configuration.cleanDB();
    await app.close();
  });
});
