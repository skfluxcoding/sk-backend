const SessionAudit = require('../models/session-audit.model');

exports.log = async ({
  userId,
  event,
  deviceId,
  req,
  metadata = {}
}) => {
  await SessionAudit.create({
    userId,
    event,
    deviceId,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    metadata
  });
};
