const request = require('supertest');
const app = require('../app');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

// register, login then store the token for use in the rest of the tests


// tests
describe('CRUD tests', () => {
    beforeEach(async () => {
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
        token = res.body.accessToken;
    });
    let token;
    // get all todos for new user
    describe('GET /api/v1/todo', () => {
        it('should return empty array', async () => {
            const res = await request(app)
                .get('/api/v1/todo')
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });
    });
    // create a todo
    describe('POST /api/v1/todo', () => {
        it('should create a new todo', async () => {
            const res = await request(app)
                .post('/api/v1/todo')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Todo',
                    description: 'This is a test todo',
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('title', 'Test Todo');
            expect(res.body).toHaveProperty('description', 'This is a test todo');
        });
    });

    // create a todo then get it by id
    describe('GET /api/v1/todo/:id', () => {
        it('should get the todo by id', async () => {
            // First, create a todo
            const createRes = await request(app)
                .post('/api/v1/todo')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Todo',
                    description: 'This is a test todo',
                });

            // Then, get the todo by its ID
            const res = await request(app)
                .get(`/api/v1/todo/${createRes.body._id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('title', 'Test Todo');
            expect(res.body).toHaveProperty('description', 'This is a test todo');
        });
    });

    // update a todo then get it by id to make sure it was updated
    describe('PUT /api/v1/todo/:id', () => {
        it('should update the todo', async () => {
            // First, create a todo
            const createRes = await request(app)
                .post('/api/v1/todo')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Todo',
                    description: 'This is a test todo',
                });

            // Then, update the todo
            const res = await request(app)
                .put(`/api/v1/todo/${createRes.body._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Updated Todo',
                    description: 'This is an updated todo',
                    completed: true,
                });
            // Then, get the todo by its ID to make sure it was updated
            const getRes = await request(app)
                .get(`/api/v1/todo/${createRes.body._id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
            expect(getRes.body).toHaveProperty('title', 'Updated Todo');
            expect(getRes.body).toHaveProperty('description', 'This is an updated todo');
            expect(getRes.body).toHaveProperty('completed', true);
        });
    });

    // delete a todo
    describe('DELETE /api/v1/todo/:id', () => {
        it('should delete the todo', async () => {
            // First, create a todo
            const createRes = await request(app)
                .post('/api/v1/todo')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Todo',
                    description: 'This is a test todo',
                });

            // Then, delete the todo
            const res = await request(app)
                .delete(`/api/v1/todo/${createRes.body._id}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
        });
    });
});
// access control tests
describe('Access control', () => { 
    //before each register 2 user, login and grab their tokens
    beforeEach(async () => {
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
        token = res.body.accessToken;
    await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser2',
          email: 'testuser2@email.com',
          password: 'testpassword2',
        });
        const res2 = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'testuser2@email.com',
          password: 'testpassword2',
        });
        token2 = res2.body.accessToken;
    });
    let token;
    let token2;
    // get a todo that belongs to another user
    describe('GET /api/v1/todo/:id', () => {
        it('should not get the todo that belongs to another user', async () => {
            // First, create a todo with the first user
            const createRes = await request(app)
                .post('/api/v1/todo')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Todo',
                    description: 'This is a test todo',
                });
            // Then, try to get the todo with the second user
            const res = await request(app)
                .get(`/api/v1/todo/${createRes.body._id}`)
                .set('Authorization', `Bearer ${token2}`);
            expect(res.statusCode).toEqual(404);
        });
    });
    // try to update a todo that belongs to another user
    describe('PUT /api/v1/todo/:id', () => {
        it('should not update the todo that belongs to another user', async () => {
            // First, create a todo with the first user
            const createRes = await request(app)
                .post('/api/v1/todo')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Todo',
                    description: 'This is a test todo',
                });

            // Then, try to update the todo with the second user
            const res = await request(app)
                .put(`/api/v1/todo/${createRes.body._id}`)
                .set('Authorization', `Bearer ${token2}`)
                .send({
                    title: 'Updated Todo',
                    description: 'This is an updated todo',
                    completed: true,
                });
            expect(res.statusCode).toEqual(404);
        });
    });
    // try to delete a todo that belongs to another user
    describe('DELETE /api/v1/todo/:id', () => {
        it('should not delete the todo that belongs to another user', async () => {
            // First, create a todo with the first user
            const createRes = await request(app)
                .post('/api/v1/todo')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Todo',
                    description: 'This is a test todo',
                });

            // Then, try to delete the todo with the second user
            const res = await request(app)
                .delete(`/api/v1/todo/${createRes.body._id}`)
                .set('Authorization', `Bearer ${token2}`);
            expect(res.statusCode).toEqual(404);
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