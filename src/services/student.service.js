const Student = require('../models/student.model');

exports.create = (data) => Student.create(data);
exports.findAll = () => Student.find({ deleted: false });
exports.findById = (id) => Student.findOne({ _id: id, deleted: false });
exports.update = (id, data) =>
  Student.findOneAndUpdate({ _id: id, deleted: false }, data, { new: true });
exports.remove = (id) =>
  Student.findByIdAndUpdate(id, { deleted: true }, { new: true });
