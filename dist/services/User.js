class User {
    constructor(name, password, id) {
        this.name = name;
        this.id = id;
        this.password = password;
    }
    ;
    chechPassword(compareUser) {
        return this.password == compareUser.password;
    }
}
;
var Comparisons;
(function (Comparisons) {
    Comparisons[Comparisons["name"] = 0] = "name";
    Comparisons[Comparisons["id"] = 1] = "id";
})(Comparisons || (Comparisons = {}));
;
class UsersStorage {
    constructor() {
        this._users = [];
    }
    get users() {
        return this._users;
    }
    ;
    add(user) {
        this._users.push(user);
    }
    ;
    findBy(key, value) {
        let user;
        switch (key) {
            case Comparisons.name: {
                this._users.forEach((it) => {
                    if (it.name == value) {
                        user = it;
                        return it;
                    }
                    ;
                });
                break;
            }
            case Comparisons.id:
                {
                    this._users.forEach((it) => {
                        if (it.id == value) {
                            user = it;
                            return it;
                        }
                        ;
                    });
                    break;
                }
                ;
        }
        ;
        return user;
    }
    ;
    check(user, compareUser) {
        return user.password == compareUser.password;
    }
    ;
    isValid(user) {
        const isValid = this.findBy(Comparisons.name, user.name);
        return !Boolean(isValid);
    }
    ;
}
export { User, UsersStorage, Comparisons };
//# sourceMappingURL=User.js.map