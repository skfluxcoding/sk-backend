const ResourceAlreadyExistsException = require("../exception/resource.already.exists.exception");
const User = require("../models/user.model");
const passwordUtil = require('../utils/password.util');

exports.create = async (data) => {
    let { email, password, roles } = data;

    email = email.toLowerCase();
    const exists = await User.findOne({ email });

    if (exists) {
        throw new ResourceAlreadyExistsException('User already exists');
    }

    if (!roles || roles.length === 0) {
        roles = ['USER'];
    } else {
        const validRoles = ['USER', 'ADMIN'];
        roles = roles.filter(role => validRoles.includes(role));
        if (roles.length === 0) {
            roles = ['USER'];
        }
    }
    const passwordHashed = await passwordUtil.hash(password);
    const user = await User.create({
        email,
        password: passwordHashed,
        roles
    });

    return {
        userId: user._id,
        email: user.email,
        roles: user.roles
    };
}
