const { default: mongoose } = require('mongoose');
const Course = require('../models/course.model');

exports.list = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const options = {
    page,
    limit,
    sort: { createdAt: -1 }
  };

  const result = await Course.paginate({}, options);

  res.json(result);
};

exports.get = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "ID de MongoDB inválido"
    });
  }


  const course = await Course.findById(id);
  if (!course) return res.sendStatus(404);
  res.json(course);
};

exports.create = async (req, res) => {
  const { title, description, instructor, published } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const course = await Course.create({ title, description, instructor, published });

  res.status(201).json(course);
};

exports.update = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "ID de MongoDB inválido"
    });
  }

  const updates = req.body;

  const course = await Course.findByIdAndUpdate(id, updates, { new: true });
  if (!course) return res.sendStatus(404);

  res.json(course);
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "ID de MongoDB inválido"
    });
  }

  const course = await Course.findByIdAndDelete(id);
  if (!course) return res.sendStatus(404);
  res.sendStatus(204);
};

exports.softDelete = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "ID de MongoDB inválido"
    });
  }
  
  const course = await Course.findById(id);
  if (!course) return res.sendStatus(404);

  course.deleted = true;
  await course.save();

  res.sendStatus(204);
}