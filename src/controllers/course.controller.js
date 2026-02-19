const courseService = require('../services/course.service');

exports.paginate = async (req, res) => {
  let page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 10;

  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  if (limit > 100) limit = 100;

  const result = await courseService.paginate(page, limit);
  return res.status(200).json(result);
}

exports.create = async (req, res) => {
  const course = await courseService.create(req.body)
  return res.status(201).json(course);
}

exports.findOne = async (req, res) => {
  const { id } = req.params;
  const course = await courseService.findById(id);
  return res.status(200).json(course);
}

exports.update = async (req, res) => {
  const { id } = req.params;
  const course = await courseService.update(id, req.body);
  return res.status(200).json(course);
};

exports.softDelete = async (req, res) => {
  const { id } = req.params;
  await courseService.softDelete(id);
  return res.sendStatus(204);
}