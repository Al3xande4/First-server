import { HttpExeption } from '../services/Errors.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const errorMiddleware = (error, req, res, next) => {
    res.status(error.status).send(error.message);
    next();
};
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        throw new HttpExeption('No token', 401);
    }
    ;
    if (process.env.ACCESS_TOKEN != null) {
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, username) => {
            if (err) {
                throw new HttpExeption('Token is not valid', 403);
            }
            ;
            req.body.username = username;
            next();
        });
    }
    ;
};
export { errorMiddleware, authenticateToken };
//# sourceMappingURL=Middlewares.js.map