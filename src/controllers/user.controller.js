const { sendVerificationCode } = require('../services/mail.service');
const userService = require('../services/user.service');

exports.create = async (req, res) => {
    const user = await userService.create(req.body);

    const code = Math.floor(100000 + Math.random() * 900000);

    const info = await sendVerificationCode(user.email, code);
    console.log(info);
    
    return res.status(201).json(user);
}