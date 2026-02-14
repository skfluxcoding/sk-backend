const { default: mongoose } = require('mongoose');
const Course = require('../models/course.model');

exports.findAll = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const options = {
    page,
    limit,
    sort: { createdAt: -1 },
    select: 'title description instructor published',
    populate: {
      path: 'instructor',
      select: 'email'
    }
  };

  const result = await Course.paginate({ enabled: 1 }, options);

  const data = result.docs.map(course => ({
    courseId: course._id,
    title: course.title,
    description: course.description,
    instructor: {
      uid: course.instructor._id,
      email: course.instructor.email,
    },
    published: course.published
  }));

  result.docs = data;

  res.json(result);
};

exports.create = async (req, res) => {
  const { title, description, instructor, published } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  const course = await Course.create({ title, description, instructor, published })

  res.status(201).json({
    courseId: course._id,
    title: course.title,
    description: course.description,
    instructor: {
      uid: course.instructor._id,
      email: course.instructor.email,
    },
    published: course.published
  });
};

exports.findOne = async (req, res) => {
  const { id } = req.params;

  const course = await Course.findOne({ _id: id, enabled: 1 });
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  res.status(200).json(course);
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid course id' });
    }

    const course = await Course.findOneAndUpdate(
      { _id: id, enabled: true },
      updates,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found or disabled' });
    }

    return res.status(200).json(course);

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.softDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid course id' });
    }

    const course = await Course.findOneAndUpdate(
      { _id: id, enabled: true },
      { enabled: false },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found or already disabled' });
    }

    return res.sendStatus(204);

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};