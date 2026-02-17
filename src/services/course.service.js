const ResourceNotFoundException = require('../exception/resourceNotFoud.exception');
const Course = require('../models/course.model');

exports.paginate = async (page, limit) => {
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
    published: course.published
  }));

  return {
    ...result,
    docs: data
  }
}

exports.create = async (data) => {
  const { title, description, instructor, published } = data;

  const course = await Course.create({
    title,
    description,
    instructor,
    published
  });

  return {
    courseId: course._id,
    title: course.title,
    description: course.description,
    published: course.published
  }

}



exports.findById = async (id) => {
  const course = await Course.findOne({ _id: id });
  if (!course) {
    throw new ResourceNotFoundException('Course not found');
  }
  return {
    courseId: course._id,
    title: course.title,
    description: course.description,
    published: course.published
  }
}

exports.update = async (id, data) => {
  const course = await Course.findOneAndUpdate({ _id: id, deleted: false }, data, { new: true });
  if (!course) {
    throw new ResourceNotFoundException('Course not found or disabled');
  }
  return {
    courseId: course._id,
    title: course.title,
    description: course.description,
    published: course.published
  }
}

exports.softDelete = async (id) => {
  const course = await Course.findOneAndUpdate(
    { _id: id, enabled: true },
    { enabled: false },
    { new: true }
  );

  if (!course) {
    throw new ResourceNotFoundException('Course not found or already disabled');
  }
}
