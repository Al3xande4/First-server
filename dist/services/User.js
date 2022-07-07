;
let users = [];
const addUser = (user) => {
    users.push(user);
};
const getUsers = () => {
    return users;
};
const checkPassword = (user, realUser) => {
    return user.password == realUser.password;
};
const getUserWithName = (name) => {
    let user = undefined;
    users.forEach((it) => {
        if (it.name == name) {
            user = it;
        }
        ;
    });
    return user;
};
const isValid = (user) => {
    const isValid = getUserWithName(user.name);
    return !Boolean(isValid);
};
export { addUser, getUsers, getUserWithName, checkPassword, isValid };
//# sourceMappingURL=User.js.map