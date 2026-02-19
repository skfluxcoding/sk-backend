const userService = require('../services/user.service');

exports.create = async (req, res) => {
    const user = await userService.create(req.body);
    return res.status(201).json(user);
}