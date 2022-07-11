export class User{
    name: string;
    email?: string;

    private readonly _password: string;
    get password(){
        return this._password;
    };

    id?: number;

    constructor(name: string, password: string, email?: string, id?: number) {
        this.name = name;
        this._password = password;
        this.email = email;
        this.id =id;
    };
};