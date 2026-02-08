const { default: mongoose } = require('mongoose');
const Student = require('../models/student.model');

exports.list = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const options = {
        page,
        limit,
        sort: { createdAt: -1 }
    };

    const result = await Student.paginate({ deleted: false }, options);
    res.json(result);
};

exports.get = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de MongoDB inválido' });
    }

    const student = await Student.findOne({ _id: id, deleted: false });
    if (!student) return res.sendStatus(404);

    res.json(student);
};

exports.create = async (req, res) => {
    const { name, email, age } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    const student = await Student.create({ name, email, age });
    res.status(201).json(student);
};

exports.update = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de MongoDB inválido' });
    }

    const student = await Student.findByIdAndUpdate(id, req.body, { new: true });
    if (!student) return res.sendStatus(404);

    res.json(student);
};

exports.remove = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de MongoDB inválido' });
    }

    const student = await Student.findByIdAndDelete(id);
    if (!student) return res.sendStatus(404);

    res.sendStatus(204);
};

exports.softDelete = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de MongoDB inválido' });
    }

    const student = await Student.findById(id);
    if (!student) return res.sendStatus(404);

    student.deleted = true;
    await student.save();

    res.sendStatus(204);
};
