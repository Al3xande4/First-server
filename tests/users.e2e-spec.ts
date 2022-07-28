import { App } from "../src/app";
import { boot } from "../src/main";
import request from 'supertest';
import { PhotoCreateDto } from "../src/photos/dto/photo-create.dto";

let application: App;

beforeAll(async () => {
    const { app } = await boot;
    application = app;
})

const EXISTED_EMAIL = 'a@a.com';
const PASSWORD = '1234';
const WRONG_PASS = 'wrong';
const NOT_EXISTED_EMAIL = 'b@b.com';


describe('', () => {
    it('Register - error', async () => {
        const res = await request(application.app)
            .post('/users/register/')
            .send({ email: EXISTED_EMAIL, name: 'AAAA', password: PASSWORD})

        expect(res.statusCode).toBe(422);
    })

    it('Login - success', async () => {
        const res = await request(application.app)
            .post('/users/login')
            .send({ email: EXISTED_EMAIL, password: PASSWORD})
        expect(res.statusCode).toBe(200);
        expect(res.body.jwt).not.toBeUndefined();
    })

    it('Login - error(wrong password)', async () => {
        const res = await request(application.app)
            .post('/users/login')
            .send({ email: EXISTED_EMAIL, password: WRONG_PASS});

        expect(res.statusCode).toBe(401);
    })

    it('Login - error(wrong email)', async () => {
        const res = await request(application.app)
            .post('/users/login')
            .send({ email: NOT_EXISTED_EMAIL, password: PASSWORD});

        expect(res.statusCode).toBe(401);
    })

    it('Users - success', async () => {
        const login = await request(application.app)
            .post('/users/login')
            .send({ email: EXISTED_EMAIL, password: PASSWORD})

        const res = await request(application.app)
            .get('/users')
            .set('Authorization', `Bearer ${login.body.jwt}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.users).not.toBeUndefined();
    })

    it('Users - error(no jwt token)', async () => {

        const res = await request(application.app)
            .get('/users')
        
        expect(res.statusCode).toBe(401);
    })

})

afterAll(() => {
    application.close();
})
