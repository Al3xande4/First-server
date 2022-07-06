import express from 'express';
import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

const router = express.Router();

router.use(jsonParser);

let users = [];

router.get('/', (req, res) => {
    res.send(users);
});

router.post('/register', (req, res) => {
    const user = req.body.User
    if(users.find(it => it.name == user.name)) {
        throw Error(`User with name ${user.name} already exists`);
    };
    users.push(user);
    res.send(`You successfully registered as ${user.name}`);
});

router.post('/login', (req, res) => {
    const user = req.body.User
    const result = users.find(it => it.name == user.name);
    if(result){
        if(result.password == user.password) {
            res.send(`You logged in as ${user.name}`)
        }
        else{
            throw Error('Wrong password');
        };
    }
    else{
        throw Error(`No sush user with name ${user.name}`)
    };
});

const errorLogger = (err, req, res, next) => {
    res.status(400).send(err.message);
    next();
};

router.use(errorLogger);


export { router }
