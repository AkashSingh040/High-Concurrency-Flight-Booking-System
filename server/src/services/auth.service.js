const bcrypt=require("bcrypt");
const userRepository = require("../repositories/user.repository");

const register = async ({ name, email, password }) => {

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new Error("Email already registered");
    }

    const passwordHash=await bcrypt.hash(password,12);

    const user = await userRepository.create({
        name,
        email,
        passwordHash
    });

    return user;
};

module.exports = {
    register
};