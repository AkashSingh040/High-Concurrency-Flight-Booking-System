const userRepository = require("../repositories/user.repository");

const register = async ({ name, email, password }) => {

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new Error("Email already registered");
    }

    const user = await userRepository.create({
        name,
        email,
        passwordHash: password
    });

    return user;
};

module.exports = {
    register
};