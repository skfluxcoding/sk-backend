const ResourceAlreadyExistsException = require("../exception/resource.already.exists.exception");
const User = require("../models/user.model");
const Verification = require("../models/verification.model");
const passwordProvider = require('../provider/password.provider');
const { sendVerificationCode } = require("./mail.service");

exports.create = async (data) => {
    let { email, password, roles } = data;

    email = email.toLowerCase();
    const exists = await User.findOne({ email });

    if (exists) {
        throw new ResourceAlreadyExistsException('User already exists');
    }

    if (roles.length === 0) {
        roles = ['USER'];
    } else {
        const validRoles = ['USER', 'ADMIN'];
        roles = roles.filter(role => validRoles.includes(role));
        if (roles.length === 0) {
            roles = ['USER'];
        }
    }
    const passwordHashed = await passwordProvider.hash(password);

    const user = await User.create({
        email,
        password: passwordHashed,
        roles
    });

    await Verification.updateMany(
        { user: user._id, type: 'ACTIVATE_USER', used: false },
        { used: true }
    );

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await passwordProvider.hash(code);

    await Verification.create({
        user: user._id,
        type: 'ACTIVATE_USER',
        token: hashedCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        used: false
    });

    await sendVerificationCode(user.email, code);
}