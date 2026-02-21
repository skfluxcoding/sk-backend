const passwordProvider = require('../provider/password.provider');
const jwtProvider = require('../provider/jwt.provider');
const Verification = require('../models/verification.model');
const { sendVerificationCode } = require('./mail.service');
const authRepository = require('../repository/auth.repository');
const verificationRepository = require('../repository/verification.repository');
const AuthException = require('../exception/auth.exception');

exports.register = async (data) => {
    const { email, password } = data;

    const exists = await authRepository.findByEmailIgnoreCase(email);
    if (exists) {
        throw new AuthException('EMAIL_ALREADY_EXISTS', 409);
    }

    const hashedPassword = await passwordProvider.hash(password);

    const user = await authRepository.createUser(email, hashedPassword);

    await verificationRepository.invalidateByUserAndType(user._id, 'ACTIVATE_USER');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await passwordProvider.hash(code);

    await verificationRepository.createVerification(user._id, 'ACTIVATE_USER', hashedCode);

    await sendVerificationCode(user.email, code);
}

exports.verifyEmail = async (email, code) => {
    const user = await authRepository.findByEmailIgnoreCase(email);
    if (!user) {
        throw new AuthException('USER_NOT_FOUND', 404);
    }

    const verification = await verificationRepository.findByIdUserdAndType(user._id, 'ACTIVATE_USER');

    if (!verification) {
        throw new AuthException('ACTIVATE_USER_NOT_FOUND', 409);
    }

    if (verification.expiresAt < new Date()) {
        throw new AuthException('VERIFICATION_CODE_EXPIRED', 409);
    }

    const isValidCode = await passwordProvider.compare(code, verification.token);

    if (!isValidCode) {
        throw new AuthException('VERIFICATION_CODE_INVALID', 409);
    }

    user.isActive = true;
    await user.save();

    verification.used = true;
    await verification.save();

    const token = jwtProvider.generateAccessToken(user);

    return token;
}

exports.login = async (data) => {
    const { email, password } = data;

    const user = await authRepository.findByEmailIgnoreCase(email);
    if (!user) {
        throw new AuthException('INVALID_CREDENTIALS');
    }

    const match = await passwordProvider.compare(password, user.password);
    if (!match) {
        throw new AuthException('INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
        throw new AuthException('ACCOUNT_NOT_ACTIVATED');
    }

    const token = jwtProvider.generateAccessToken(user);

    return {
        accessToken: token
    };
};

exports.resendVerification = async (email) => {
    const user = await authRepository.findByEmailIgnoreCase(email);

    if (!user) {
        throw new AuthException('USER_NOT_FOUND', 404);
    }

    if (user.isActive) {
        throw new AuthException('ACCOUNT_ALREADY_ACTIVE', 409);
    }

    const lastVerification = await verificationRepository.findLastActiveByUserAndType(user._id, 'ACTIVATE_USER');

    if (lastVerification) {
        const secondsSinceLast = (Date.now() - lastVerification.createdAt.getTime()) / 1000;

        if (secondsSinceLast < 60) {
            throw new AuthException('WAIT_BEFORE_REQUESTING_NEW_CODE', 409);
        }
    }

    await verificationRepository.invalidateByUserAndType(user._id, 'ACTIVATE_USER');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await passwordProvider.hash(code);

    await verificationRepository.createVerification(user._id, 'ACTIVATE_USER', hashedCode);

    await sendVerificationCode(user.email, code);
};
