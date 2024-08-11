import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { testModule, usePipes } from '../test.module';
import { PrismaClient } from '@prisma/client';

const mockUser = {
  name: 'Jhon',
  lastName: 'Doe',
  userName: 'jhonDoe123',
  email: 'jhondo@email.com',
  password: 'MyNotT0We@kP@$$Word',
};

const BASE_URL = '/users';

describe('User End-to-End Tests', () => {
  let app: INestApplication;
  let client: PrismaClient;
  let id: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await testModule.compile();

    app = moduleFixture.createNestApplication();
    usePipes(app);
    client = new PrismaClient();
    await app.init();
  });

  it('should create a new user', async () => {
    // GIVEN: A mock user object with valid data to be registered

    // WHEN: Attempting to create a new user by sending a POST request with the mock user data
    const { body, statusCode } = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(mockUser);

    // THEN: The status code should be 201, indicating successful creation of the user
    expect(statusCode).toEqual(201);

    // THEN: The response body should contain the userName and email of the newly created user
    expect(body).toHaveProperty('userName', mockUser.userName);
    expect(body).toHaveProperty('email', mockUser.email);

    // THEN: Store the ID of the newly created user for further tests
    id = body.id;
  });

  it('should throw an error if the user already exists', async () => {
    // GIVEN: A mock user object that is already registered in the system

    // WHEN: Attempting to register the same user again by sending a POST request
    const { body, statusCode } = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(mockUser);

    // THEN: The status code should be 400, indicating a bad request due to the user already existing
    expect(statusCode).toEqual(400);

    // THEN: The response body should contain an error message indicating that the user already exists
    expect(body).toHaveProperty('message', 'User already exist');
    expect(body).toHaveProperty('error', 'Bad Request');
  });

  it('should throw an error if the user has invalid characters', async () => {
    // GIVEN: A mock user object with an invalid name (contains a number)

    mockUser.name = 'Bill5'; // Invalid Name
    mockUser.userName = 'NewUser';
    mockUser.email = 'bill@mail.com';

    // WHEN: Attempting to register the user with the invalid name by sending a POST request
    const { body, statusCode } = await request(app.getHttpServer())
      .post(`${BASE_URL}/register`)
      .send(mockUser);

    // THEN: The status code should be 400, indicating a bad request due to invalid user data
    expect(statusCode).toEqual(400);

    // THEN: The response body should contain an error message indicating that the user name is not valid
    expect(body).toHaveProperty('message', 'User name is not valid');
    expect(body).toHaveProperty('error', 'Bad Request');
  });

  it('should throw an error if the user does not exist when trying to update', async () => {
    // GIVEN: A non-existent user ID (an invalid ID is provided) and some user data to update

    // WHEN: Attempting to update the user with the non-existent ID by sending a PATCH request
    const { body, statusCode } = await request(app.getHttpServer())
      .patch(`${BASE_URL}/update/${id}dd`)
      .send(mockUser);

    // THEN: The status code should be 404, indicating that the user was not found
    expect(statusCode).toEqual(404);

    // THEN: The response body should contain an error message indicating that the user was not found
    expect(body).toHaveProperty('message', 'User not found');
    expect(body).toHaveProperty('error', 'Not Found');
  });

  it('should update a user', async () => {
    // GIVEN: A user ID and new user data (name, userName, email) to update the existing user

    // WHEN: The user is updated by sending a PATCH request with the new data
    const { statusCode } = await request(app.getHttpServer())
      .patch(`${BASE_URL}/update/${id}`)
      .send({
        name: 'Bill',
        userName: 'BillDoe432',
        email: 'bill@mail.com',
      });

    // WHEN: Retrieving the updated user data by sending a POST request to match the user by ID
    const { body } = await request(app.getHttpServer())
      .post(`${BASE_URL}/match`)
      .send({ id });

    // THEN: The status code should be 200, indicating a successful update
    expect(statusCode).toEqual(200);

    // THEN: The response body should contain the updated user data (name, userName, email)
    expect(body).toHaveProperty('name', 'Bill');
    expect(body).toHaveProperty('userName', 'BillDoe432');
    expect(body).toHaveProperty('email', 'bill@mail.com');
  });

  it('should throw an error if the user does not exist when trying to delete', async () => {
    // GIVEN: A non-existent user ID (an invalid ID is provided)

    // WHEN: Attempting to delete the user with the non-existent ID by sending a DELETE request
    const { body, statusCode } = await request(app.getHttpServer()).delete(
      `${BASE_URL}/delete/${id}dd`,
    );

    // THEN: The status code should be 404, indicating that the user was not found
    expect(statusCode).toEqual(404);

    // THEN: The response body should contain an error message indicating that the user was not found
    expect(body).toHaveProperty('message', 'User not found');
    expect(body).toHaveProperty('error', 'Not Found');
  });

  it('should delete a user', async () => {
    // GIVEN: A user ID that exists in the database

    // WHEN: The user is deleted by sending a DELETE request to the server
    const { statusCode } = await request(app.getHttpServer()).delete(
      `${BASE_URL}/delete/${id}`,
    );

    // WHEN: Attempting to retrieve the user after deletion
    const { body } = await request(app.getHttpServer())
      .post(`${BASE_URL}/match`)
      .send({ id });

    // THEN: The status code should be 204, indicating a successful deletion
    expect(statusCode).toEqual(204);

    // THEN: The user data should no longer exist in the response body
    expect(body).not.toHaveProperty('name', body.name);
    expect(body).not.toHaveProperty('lastName', body.lastName);
    expect(body).not.toHaveProperty('email', body.email);
    expect(body).not.toHaveProperty('userName', body.userName);
    expect(body).not.toHaveProperty('password', body.password);
  });

  afterAll(async () => {
    await client.users.deleteMany();
    await app.close();
  });
});
