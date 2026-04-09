const request = require('supertest');
const app = require('../app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

describe('Auth routes', () => {
    // Test user registration
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          email: 'testuser@email.com',
          password: 'testpassword',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'User registered successfully!');
    });
  });
  // Test duplicate email registration
  describe('POST /api/v1/auth/register', () => {
    it('user registers with dupe email', async () => {
        await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          email: 'testuser@email.com',
          password: 'testpassword',
        });
      const res2 = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser2',
          email: 'testuser@email.com',
          password: 'testpassword2',
        });
      expect(res2.statusCode).toEqual(400);
      expect(res2.body).toHaveProperty('message', 'Failed! Email is already in use!');
    });
  });

  // test user login
  describe('POST /api/v1/auth/login', () => { 
    it('should login successfully', async () => {
        await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          email: 'testuser@email.com',
          password: 'testpassword',
        });
        const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'testuser@email.com',
          password: 'testpassword',
        });
      expect(res.statusCode).toEqual(200);
      // should return a jwt token and user info
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('username', 'testuser');
      expect(res.body).toHaveProperty('email', 'testuser@email.com');
      expect(res.body).toHaveProperty('accessToken');
    });
  });
  // test login with wrong password
  describe('POST /api/v1/auth/login', () => { 
    it('login should fail', async () => {
        await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          email: 'testuser@email.com',
          password: 'testpassword',
        });
        const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'testuser@email.com',
          password: 'babaooey',
        });
      expect(res.statusCode).toEqual(401);
      // should return a jwt token and user info
      expect(res.body).toHaveProperty('message', 'Invalid email and password combination.');
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  // wipe all collections between tests so they don't bleed into each other
  await mongoose.connection.db.dropDatabase();
});
