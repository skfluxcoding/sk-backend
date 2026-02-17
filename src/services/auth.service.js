const passwordUtil = require('../utils/password.util');
const jwtUtil = require('../utils/jwt.util');
const User = require('../models/user.model');
const ResourceAlreadyExistsException = require('../exceptions/resourceAlreadyExists.exception');
const UserNotFoundException = require('../exception/user.notfound.exception');

exports.register = async (data) => {
    let { email, password } = data;

    const exists = await User.findOne({ email });
    if (exists) {
        throw new ResourceAlreadyExistsException('User already exists');
    }

    const hashedPassword = await passwordUtil.hash(password);

    const user = await User.create({
        email,
        password: hashedPassword
    });

    const token = jwtUtil.generateAccessToken(user);

    return token;
}

exports.login = async (data) => {
    let { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) {
        throw new UserNotFoundException('Invalid credentials');
    }

    const match = await passwordUtil.compare(password, user.password);
    if (!match) {
        throw new UserNotFoundException('Invalid credentials');
    }

    const token = jwtUtil.generateAccessToken(user);

    return token;
}