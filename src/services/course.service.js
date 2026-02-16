const ResourceNotFoundException = require('../exception/resourceNotFoud.exception');
const Course = require('../models/course.model');

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

exports.findAll = () => Course.find({ deleted: false });

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

exports.update = (id, data) => {
  const course = Course.findOneAndUpdate({ _id: id, deleted: false }, data, { new: true });
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

exports.remove = (id) =>
  Course.findByIdAndUpdate(id, { deleted: true }, { new: true });

exports.paginate = (options) =>
  Course.paginate({ deleted: false }, options);
