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

let photoId = 1;
const WRONG_ID = -1;

describe('', () => {

    it('Create Photo - success', async () => {
        const login = await request(application.app)
            .post('/users/login')
            .send({ email: EXISTED_EMAIL, password: PASSWORD})

        const res = await request(application.app)
            .post('/photos/create')
            .set('Authorization', `Bearer ${login.body.jwt}`)
            .send({
                url: "https://github.com/typestack/class-validator",
                position: {
                    location: {
                        lat: 41.432,
                        lng: 541.51
                    },
                    rotation: {
                        x: 23,
                        y: 32,
                        z: 65
                    },
                    direction: 314
                }
            });
        
        expect(res.statusCode).toBe(200);
        photoId = res.body.photo.id;
        console.log(photoId)
    })

    it('Get Photo - success', async () => {
        const login = await request(application.app)
            .post('/users/login')
            .send({ email: EXISTED_EMAIL, password: PASSWORD})

        const res = await request(application.app)
            .post('/photos/get')
            .set('Authorization', `Bearer ${login.body.jwt}`)
            .send({id: photoId})
        
        expect(res.statusCode).toBe(200);
        expect(res.body.photo.id).toBe(photoId);
    })

    it('Get Photo - error', async () => {
        const login = await request(application.app)
            .post('/users/login')
            .send({ email: EXISTED_EMAIL, password: PASSWORD})

        const res = await request(application.app)
            .post('/photos/get')
            .set('Authorization', `Bearer ${login.body.jwt}`)
            .send({id: WRONG_ID})
        
        expect(res.statusCode).toBe(422);
    })
})

afterAll(() => {
    application.close();
})
