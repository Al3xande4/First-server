interface User{
    name: string,
    password: string
};

let users: User[] = [];

const addUser = (user: User) => {
    users.push(user);
};

const getUsers = (): User[] => {
    return users;
};

const checkPassword = (user: User, realUser: User): Boolean => {
    return user.password == realUser.password;
};

const getUserWithName = (name: string): User | undefined => {
    let user: User | undefined = undefined;
    users.forEach((it) => {
        if(it.name == name) {
            user = it;
        };
    });
    return user;
};

const isValid = (user: User): Boolean => {
    const isValid = getUserWithName(user.name);
    return !Boolean(isValid);
};

export { addUser, getUsers, getUserWithName, checkPassword, User, isValid }
