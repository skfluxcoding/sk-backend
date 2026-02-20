const passwordUtil = require('../utils/password.util');
const jwtUtil = require('../utils/jwt.util');
const User = require('../models/user.model');
const UserNotFoundException = require('../exception/user.notfound.exception');
const ResourceAlreadyExistsException = require('../exception/resource.already.exists.exception');
const Verification = require('../models/verification.model');
const { sendVerificationCode } = require('./mail.service');

exports.register = async (data) => {
    const { email, password } = data;

    const exists = await User.findOne({ email });
    if (exists) {
        throw new ResourceAlreadyExistsException('User already exists');
    }

    const hashedPassword = await passwordUtil.hash(password);

    const user = await User.create({
        email,
        password: hashedPassword
    });

    // Invalidate previous active tokens just in case
    await Verification.updateMany(
        { user: user._id, type: 'ACTIVATE_USER', used: false },
        { used: true }
    );

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await passwordUtil.hash(code);

    await Verification.create({
        user: user._id,
        type: 'ACTIVATE_USER',
        token: hashedCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        used: false
    });

    await sendVerificationCode(user.email, code);
}

exports.verifyEmail = async (email, code) => {
    const user = await User.findOne({ email });    
    if (!user) {
        throw new ResourceAlreadyExistsException('User not found');
    }

    const verification = await Verification.findOne({
        user: user._id,
        type: 'ACTIVATE_USER',
        used: false,
        expiresAt: { $gt: new Date() }
    });    

    code = code.toString();
    const isValidCode = verification && await passwordUtil.compare(code, verification.token);

    console.log(isValidCode);
    

    if (!verification || !isValidCode) {
        throw new ResourceAlreadyExistsException('Invalid or expired verification code');
    }

    user.isActive = true;
    await user.save();

    verification.used = true;
    await verification.save();

    const token = jwtUtil.generateAccessToken(user);

    return token;

}

exports.login = async (data) => {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) {
        throw new UserNotFoundException('INVALID_CREDENTIALS');
    }

    const match = await passwordUtil.compare(password, user.password);
    if (!match) {
        throw new UserNotFoundException('INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
        throw new UserNotFoundException('ACCOUNT_NOT_ACTIVATED');
    }

    if (user.twoFactorEnabled) {
        return {
            requiresTwoFactor: true,
            userId: user._id
        };
    }

    const token = jwtUtil.generateAccessToken({
        uid: user._id,
        roles: user.roles
    });

    return {
        accessToken: token
    };
};
