import { ILogger } from "../../logger/logger.interface";
import { Storage } from "./storage.interface";
import { User } from "./user";

export class UsersStorage implements Storage{

    logger: ILogger;

    private _users: User[];

    get users(){
        return this._users;
    };

    constructor(logger: ILogger){
        this._users = [];
        this.logger = logger;
    };


    find(name: string){
        for(const user of this.users) {
            if(user.name === name) {
                this.logger.info('user was found');
                return user;
            };
        };
        

        return undefined;
    };
    
    insert(user: User){
        this._users.push(user);
        this.logger.info('user created');
    };

    valid(user: User){
        return !Boolean(this.find(user.name));
    };

    get(id: number){
        return this._users[id];
    };
    
};