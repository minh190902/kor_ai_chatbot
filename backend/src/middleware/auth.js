module.exports = function (req, res, next) {
  // Ví dụ: header Authorization check
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // TODO: validate token
  // If valid:
  // req.user = decodedUser;
  next();
};
