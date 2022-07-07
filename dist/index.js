import express from 'express';
import { router } from './routes/users.js';
const app = express();
app.use('/users', router);
app.get('/', (req, res) => {
    res.send('Hello');
});
app.listen(3000, () => {
});
//# sourceMappingURL=index.js.map