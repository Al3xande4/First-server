class User{
    name: string;
    password: string;
    id: number;

    constructor(name: string, password: string, id: number){
        this.name = name;
        this.id = id;
        this.password = password;
    };

    chechPassword(compareUser: User){
        return this.password == compareUser.password;
    }
};

enum Comparisons{
    name,
    id
};

interface Storage{
    add(user: User): void;
    findBy(key: Comparisons, value: any): User | undefined;
    check(user: User, compareUser: User): Boolean;
    isValid(user: User): Boolean;
}

class UsersStorage implements Storage{

    private _users: User[] = [];

    get users(){
        return this._users;
    };

    add(user: User): void {
        this._users.push(user);        
    };


    findBy(key: Comparisons, value: any): User | undefined {
        let user: User | undefined
        switch(key){
            case Comparisons.name: {
                this._users.forEach((it) => {
                    if(it.name == value) {
                        user = it;
                        return it;
                    };
                });
                break;
            }
            case Comparisons.id: {
                this._users.forEach((it) => {
                    if(it.id == value) {
                        user = it;
                        return it;
                    };
                });
                break;
            };
        };
        return user;
    };


    check(user: User, compareUser: User): Boolean {
        return user.password == compareUser.password;
    };

    isValid(user: User): Boolean {
        const isValid = this.findBy(Comparisons.name, user.name);
        return !Boolean(isValid);
    };
    

}

export { User, UsersStorage, Comparisons }
