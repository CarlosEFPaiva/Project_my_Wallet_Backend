/* eslint-disable no-undef */

import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import * as usersRepository from '../src/repositories/usersRepository.js';
import * as sessionsRepository from '../src/repositories/sessionsRepository.js';
import * as recordsRepository from '../src/repositories/recordsRepository.js';
import * as fakeFactory from './utils/testVariablesFactory.js';
import { encryptPassword } from '../src/utils/externalLibs/encrypting.js';

const validUser = fakeFactory.getUser();
const validToken = fakeFactory.getToken();

afterAll(async () => {
    connection.end();
});

describe('POST /sign-up', () => {
    beforeAll(async () => {
        await usersRepository.insertNewUser({
            ...validUser,
            email: validUser.email.toLowerCase(),
        });
    });

    afterAll(async () => {
        await connection.query('DELETE FROM users;');
    });

    it('Returns status 400 if inputs are invalid', async () => {
        const body = {
            ...validUser,
            email: 'NOT AN EMAIL',
        };

        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(400);
    });

    it('Returns status 409 if email is already registered on Database (Case Insensitive)', async () => {
        const result = await supertest(app).post('/sign-up').send(validUser);
        expect(result.status).toEqual(409);
    });

    it('Returns status 201 if inputs are valid and email is not registered on Database', async () => {
        const body = fakeFactory.getUser();

        const result = await supertest(app).post('/sign-up').send(body);
        expect(result.status).toEqual(201);
    });
});

describe('POST /sign-in', () => {
    beforeAll(async () => {
        const encryptedPassword = encryptPassword(validUser.password, 10);
        await usersRepository.insertNewUser({
            name: validUser.name,
            email: validUser.email.toLowerCase(),
            password: encryptedPassword,
        });
    });

    afterAll(async () => {
        await connection.query('DELETE FROM sessions; DELETE FROM users;');
    });

    it('Returns status 400 if inputs are invalid', async () => {
        const body = {
            ...validUser,
            email: 'NOT AN EMAIL',
        };

        const result = await supertest(app).post('/sign-in').send(body);
        expect(result.status).toEqual(400);
    });

    it('Returns status 401 if email is not registered', async () => {
        const body = fakeFactory.getUser();

        const result = await supertest(app).post('/sign-in').send(body);
        expect(result.status).toEqual(401);
    });

    it('Returns status 401 if password is incorrect', async () => {
        const body = {
            ...validUser,
            password: fakeFactory.getStrongPassword(),
        };

        const result = await supertest(app).post('/sign-in').send(body);
        expect(result.status).toEqual(401);
    });

    it('Returns status 200 and a token if inputs are valid', async () => {
        const body = validUser;

        const result = await supertest(app).post('/sign-in').send(body);
        expect(result.status).toEqual(200);
        expect(result.body).toHaveProperty('token');
    });
});

describe('GET /entries', () => {
    beforeAll(async () => {
        const encryptedPassword = encryptPassword(validUser.password, 10);
        const user = (await usersRepository.insertNewUser({
            name: validUser.name,
            email: validUser.email.toLowerCase(),
            password: encryptedPassword,
        })).rows[0];
        await sessionsRepository.insertNewSession({ userId: user.id, token: validToken });
        await recordsRepository.insertNewRecord(fakeFactory.getEntry(user.id));
        await recordsRepository.insertNewRecord(fakeFactory.getEntry(user.id));
    });

    afterAll(async () => {
        await connection.query('DELETE FROM records; DELETE FROM sessions; DELETE FROM users;');
    });

    it('Returns status 401 if token is not sent', async () => {
        const result = await supertest(app).get('/entries');
        expect(result.status).toEqual(401);
    });

    it('Returns status 404 if token is not registered in sessions Table', async () => {
        const token = fakeFactory.getToken();

        const result = await supertest(app).get('/entries').set('Authorization', `Bearer ${token}`);
        expect(result.status).toEqual(404);
    });

    it("Returns status 200 and an object with atributes 'name' and 'entries' if inputs and token are valid", async () => {
        const token = validToken;

        const result = await supertest(app).get('/entries').set('Authorization', `Bearer ${token}`);
        expect(result.status).toEqual(200);
        expect(result.body).toHaveProperty('name', validUser.name);
        expect(result.body.entries).toHaveLength(2);
    });
});

describe('POST /entries', () => {
    beforeAll(async () => {
        const encryptedPassword = encryptPassword(validUser.password, 10);
        const user = (await usersRepository.insertNewUser({
            name: validUser.name,
            email: validUser.email.toLowerCase(),
            password: encryptedPassword,
        })).rows[0];
        await sessionsRepository.insertNewSession({ userId: user.id, token: validToken });
    });

    afterAll(async () => {
        await connection.query('DELETE FROM records; DELETE FROM sessions; DELETE FROM users;');
    });

    it('Returns status 401 if token is not sent', async () => {
        const body = fakeFactory.getEntry();

        const result = await supertest(app).post('/entries').send(body);
        expect(result.status).toEqual(401);
    });

    it('Returns status 400 if inputs are invalid', async () => {
        const token = validToken;
        const body = {
            ...fakeFactory.getEntry(),
            type: 'NOT A VALID TYPE',
        };

        const result = await supertest(app).post('/entries').set('Authorization', `Bearer ${token}`).send(body);
        expect(result.status).toEqual(400);
    });

    it('Returns status 404 if token is invalid', async () => {
        const token = fakeFactory.getToken();
        const body = fakeFactory.getEntry();

        const result = await supertest(app).post('/entries').set('Authorization', `Bearer ${token}`).send(body);
        expect(result.status).toEqual(404);
    });

    it('Returns status 201 if token and inputs are valid', async () => {
        const token = validToken;
        const body = fakeFactory.getEntry();

        const result = await supertest(app).post('/entries').set('Authorization', `Bearer ${token}`).send(body);
        expect(result.status).toEqual(201);
    });
});
