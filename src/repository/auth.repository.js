const User = require("../models/user.model");

exports.findByEmailIgnoreCase = async (email) => {
    return await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
}

exports.createUser = async (email, hashedPassword) => {
    return await User.create({
        email,
        password: hashedPassword
    });
}