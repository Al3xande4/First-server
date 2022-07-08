import express from 'express';
import bodyParser from 'body-parser';
import { UsersStorage, Comparisons } from '../services/User.js';
import { errorMiddleware, authenticateToken } from '../services/Middlewares.js';
import { HttpExeption } from '../services/Errors.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const jsonParser = bodyParser.json();

const router = express.Router();

router.use(jsonParser);

const storage = new UsersStorage();


router.get('/', (req, res) => {
    res.send(storage.users);
});

router.post('/register', (req, res) => {
    const user = req.body.User;
    if(!storage.isValid(user)) {
        throw new HttpExeption(`user with name ${user.name} already exists`, 400);
    };
    storage.add(user);
    res.send(`You successfully registered as ${user.name}`);
});

router.post('/login', (req, res) => {
    const user = req.body.User
    const realUser = storage.findBy(Comparisons.name, user.name)
    if(realUser){
        if(storage.check(user, realUser)) {
            if(process.env.ACCESS_TOKEN != null) {
                const token = jwt.sign(user.name, process.env.ACCESS_TOKEN);
                res.json(token);
            };
        }
        else{
            throw new HttpExeption('Wrong password', 400);
        };
    }
    else{
        throw new HttpExeption('No such user', 400)
    };
});

router.get('/secret', authenticateToken, (req, res) => {
    res.send(req.body.username);
});

router.use(errorMiddleware);


export { router }
