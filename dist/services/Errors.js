class HttpExeption extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
;
export { HttpExeption };
//# sourceMappingURL=Errors.js.map