const StudentService = require('../services/student.service');

exports.list = async (req, res) => {
  try {
    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100;

    const result = await StudentService.paginate({
      page,
      limit,
      sort: { createdAt: -1 }
    });

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.get = async (req, res) => {
  const student = await StudentService.findById(req.params.id);
  if (!student) return res.sendStatus(404);
  res.json(student);
};

exports.create = async (req, res) => {
  const student = await StudentService.create(req.body);
  res.status(201).json(student);
};

exports.update = async (req, res) => {
  const student = await StudentService.update(req.params.id, req.body);
  if (!student) return res.sendStatus(404);
  res.json(student);
};

exports.remove = async (req, res) => {
  const student = await StudentService.remove(req.params.id);
  if (!student) return res.sendStatus(404);
  res.sendStatus(204);
};

exports.softDelete = async (req, res) => {
  const student = await StudentService.remove(req.params.id);
  if (!student) return res.sendStatus(404);
  res.sendStatus(204);
};

exports.create = async (req, res) => {
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({ message: 'name and email are required' });
  }

  const student = await StudentService.create(req.body);
  res.status(201).json(student);
};
