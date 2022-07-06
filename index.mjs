import express from 'express';
import {router} from './routes/users.mjs';

const app = express();

app.use('/users', router);

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(3000, () => {

});
