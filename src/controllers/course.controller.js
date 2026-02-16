const Course = require('../models/course.model');

exports.findAll = async (req, res) => {
  let page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 10;

  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  if (limit > 100) limit = 100; // protección básica

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

  const result = await Course.paginate({ enabled: true }, options);

  const data = result.docs.map(course => ({
    courseId: course._id,
    title: course.title,
    description: course.description,
    instructor: course.instructor
      ? {
        uid: course.instructor._id,
        email: course.instructor.email
      }
      : null,
    published: course.published
  }));

  return res.status(200).json({
    ...result,
    docs: data
  });
}


exports.create = async (req, res) => {
    const { title, description, instructor, published } = req.body;

    const course = await Course.create({
      title,
      description,
      instructor,
      published
    });

    return res.status(201).json({
      courseId: course._id,
      title: course.title,
      description: course.description,
      instructor: course.instructor
        ? {
          uid: course.instructor._id || course.instructor,
          email: course.instructor.email || undefined
        }
        : null,
      published: course.published
    });
}

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findOne({ _id: id, enabled: true });

    if (!course) {
      return res.status(404).json({ message: 'Course not found or disabled' });
    }

    return res.status(200).json(course);

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

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