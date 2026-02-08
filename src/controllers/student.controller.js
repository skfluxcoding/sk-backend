const StudentService = require('../services/student.service');

exports.list = async (req, res) => {
  const students = await StudentService.findAll();
  res.json(students);
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

exports.softDelete = async (req, res) => {
  const student = await StudentService.remove(req.params.id);
  if (!student) return res.sendStatus(404);
  res.sendStatus(204);
};
