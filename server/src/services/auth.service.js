const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
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

const login = async ({ email, password }) => {

    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const passwordValid = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordValid) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            userId: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    );

    return {
        token
    };
};

module.exports = {
    register,login
};