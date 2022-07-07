const errorMiddleware = (error, req, res, next) => {
    res.status(error.status).send(error.message);
    next();
};
export { errorMiddleware };
//# sourceMappingURL=Middlewares.js.map