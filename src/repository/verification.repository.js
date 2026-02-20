const Verification = require("../models/verification.model");

exports.findByIdUserdAndType = async (id, type) => {
    return await Verification.findOne({ user: id, type, used: false });
}

exports.findLastActiveByUserAndType = async (userId, type) => {
    return await Verification
        .findOne({ user: userId, type, used: false })
        .sort({ createdAt: -1 });
};

exports.invalidateByUserAndType = async (userId, type) => {
    return await Verification.updateMany(
        { user: userId, type, used: false },
        { used: true }
    );
};

exports.createVerification = async (userId, type, token) => {
    return await Verification.create({
        user: userId,
        type: type,
        token: token,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        used: false
    });
};
