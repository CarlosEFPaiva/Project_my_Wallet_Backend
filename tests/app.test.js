import supertest from "supertest";
import pg from "pg";
import app from "../src/app.js";
import connection from "../src/database/database.js";
import { encryptPassword } from "../src/utils/External Libs/Encrypting.js"


describe("POST /sign-up", () => {

    beforeAll(async () => {
        await connection.query(`INSERT INTO users (name, email, password) VALUES ('TESTING', 'testing@testing.com', 'TESTING');`)
    })

    afterAll(async () => {
        await connection.query(`DELETE FROM users WHERE email = 'testing@testing.com' OR email = 'notregistered@testing.com';`)
    })

    it("Returns status 400 if inputs are invalid", async () => {
        const body = {
            name: "TESTING",
            email: "NOT AN EMAIL",
            password: "Testing123*"
        }

        const result = await supertest(app).post("/sign-up").send(body);
        expect(result.status).toEqual(400);
    })

    it("Returns status 409 if email is already registered on Database (Case Insensitive)", async () => {
        const body = {
            name: "TESTING",
            email: "TESTING@testing.com",
            password: "Testing123*"
        }

        const result = await supertest(app).post("/sign-up").send(body);
        expect(result.status).toEqual(409);
    })

    it("Returns status 201 if inputs are valid and email is not registered on Database", async () => {
        const body = {
            name: "TESTING",
            email: "notRegistered@testing.com",
            password: "Testing123*"
        }

        const result = await supertest(app).post("/sign-up").send(body);
        expect(result.status).toEqual(201);
        
    })

})

describe("POST /sign-in", () => {

    beforeAll(async () => {
        const encryptedPassword = encryptPassword("Testing123*", 10);
        await connection.query(`INSERT INTO users (name, email, password) VALUES ('TESTING', 'testing@testing.com', '${encryptedPassword}');`)
    })

    afterAll(async () => {
        await connection.query(`DELETE FROM sessions USING users WHERE sessions.user_id = users.id AND users.email = 'testing@testing.com'`);
        await connection.query(`DELETE FROM users WHERE email = 'testing@testing.com';`)
    })

    it("Returns status 400 if inputs are invalid", async () => {
        const body = {
            email: "NOT AN EMAIL",
            password: "Testing123*"
        }

        const result = await supertest(app).post("/sign-in").send(body);
        expect(result.status).toEqual(400);
    })

    it("Returns status 404 if email is not registered", async () => {
        const body = {
            email: "notRegistered@testing.com",
            password: "Testing123*"
        }

        const result = await supertest(app).post("/sign-in").send(body);
        expect(result.status).toEqual(404);
    })

    it("Returns status 401 if password is incorrect", async () => {
        const body = {
            email: "testing@testing.com",
            password: "IncorrectPassword123*"
        }

        const result = await supertest(app).post("/sign-in").send(body);
        expect(result.status).toEqual(401);
    })

    it("Returns status 200 and a token if inputs are valid", async () => {
        const body = {
            email: "testing@testing.com",
            password: "Testing123*"
        }

        const result = await supertest(app).post("/sign-in").send(body);
        expect(result.status).toEqual(200);
        expect(result.body).toHaveProperty('token');
    })
})

describe("GET /entries", () => {

    beforeAll(async () => {
        const exampleDate = "2004-10-03 09:30:00.000-03";
        await connection.query(`INSERT INTO users (name, email, password) VALUES ('John Doe', 'testing@testing.com', 'TestingPassword');`);
        await connection.query(`INSERT INTO sessions (user_id, token) VALUES ((SELECT id FROM users WHERE email = 'testing@testing.com'), 'TestingToken');`);
        await connection.query(`
        INSERT INTO records 
            (user_id, date, description, type, value) 
        VALUES 
            ((SELECT id FROM users WHERE email = 'testing@testing.com'), '${exampleDate}', '1 gallon of gas', 0, 28000),
            ((SELECT id FROM users WHERE email = 'testing@testing.com'), '${exampleDate}', 'Income from finished project', 1, 50);`);
    });

    afterAll(async () => {
        await connection.query(`DELETE FROM records WHERE user_id = (SELECT id FROM users WHERE email = 'testing@testing.com');`);
        await connection.query(`DELETE FROM sessions WHERE user_id = (SELECT id FROM users WHERE email = 'testing@testing.com');`);
        await connection.query(`DELETE FROM users WHERE email = 'testing@testing.com';`);
    })

    it("Returns status 401 if token is not sent", async () => {
        const result = await supertest(app).get('/entries');
        expect(result.status).toEqual(401);
    })

    it("Returns status 404 if token is not registered in sessions Table", async () => {
        const token = "NOT REGISTERED";

        const result = await supertest(app).get('/entries').set('Authorization', `Bearer ${token}`);
        expect(result.status).toEqual(404);
    })

    it("Returns status 200 and an object with atributes 'name' and 'entries' if inputs and token are valid", async () => {
        const token = "TestingToken";

        const result = await supertest(app).get('/entries').set('Authorization', `Bearer ${token}`);
        expect(result.status).toEqual(200);
        expect(result.body).toHaveProperty("name", "John Doe");
        expect(result.body.entries).toHaveLength(2);
    })
})

describe("POST /entries", () => {

    beforeAll(async () => {
        await connection.query(`INSERT INTO users (name, email, password) VALUES ('John Doe', 'testing@testing.com', 'TestingPassword');`);
        await connection.query(`INSERT INTO sessions (user_id, token) VALUES ((SELECT id FROM users WHERE email = 'testing@testing.com'), 'TestingToken');`);
    });

    afterAll(async () => {
        await connection.query(`DELETE FROM records WHERE user_id = (SELECT id FROM users WHERE email = 'testing@testing.com');`);
        await connection.query(`DELETE FROM sessions WHERE user_id = (SELECT id FROM users WHERE email = 'testing@testing.com');`);
        await connection.query(`DELETE FROM users WHERE email = 'testing@testing.com';`);
    })

    it("Returns status 401 if token is not sent", async () => {
        const result = await supertest(app).post('/entries');
        expect(result.status).toEqual(401);
    })

    it("Returns status 400 if inputs are invalid", async () => {

        const token = "TestingToken";
        const body = {
            description: "Dunder Mifflin's ream of 20 pounds white bond paper",
            type: "NOT A VALID TYPE",
            value: 978
        }

        const result = await supertest(app).post('/entries').set('Authorization', `Bearer ${token}`).send(body);
        expect(result.status).toEqual(400);
    })

    it("Returns status 404 if token is invalid", async () => {
        const token = "NOT A VALID TOKEN";
        const body = {
            description: "Trip to the Alderaan System",
            type: 0,
            value: 1000000
        }

        const result = await supertest(app).post('/entries').set('Authorization', `Bearer ${token}`).send(body);
        expect(result.status).toEqual(404);
    })

    it("Returns status 201 if token and inputs are valid", async () => {
        const token = "TestingToken";
        const body = {
            description: "Arrascaeta Monthly Income",
            type: 0,
            value: 100000000
        }

        const result = await supertest(app).post('/entries').set('Authorization', `Bearer ${token}`).send(body);
        expect(result.status).toEqual(201);
    })
})