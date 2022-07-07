import express from 'express';
import bodyParser from 'body-parser';
import { getUsers, getUserWithName, checkPassword, addUser, isValid } from '../services/User.js';
import { errorMiddleware } from '../services/Middlewares.js';
import { HttpExeption } from '../services/Errors.js';
const jsonParser = bodyParser.json();
const router = express.Router();
router.use(jsonParser);
router.get('/', (req, res) => {
    res.send(getUsers());
});
router.post('/register', (req, res) => {
    const user = req.body.User;
    if (!isValid(user)) {
        throw new HttpExeption(`user with name ${user.name} already exists`, 400);
    }
    addUser(user);
    res.send(`You successfully registered as ${user.name}`);
});
router.post('/login', (req, res) => {
    const user = req.body.User;
    const realUser = getUserWithName(user.name);
    if (realUser) {
        if (checkPassword(user, realUser)) {
            res.send(`You logged in as ${user.name}`);
        }
        else {
            throw new HttpExeption('Wrong password', 400);
        }
        ;
    }
    else {
        throw new HttpExeption('No such user', 500);
    }
    ;
});
router.use(errorMiddleware);
export { router };
//# sourceMappingURL=users.js.map