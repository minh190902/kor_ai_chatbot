// src/middleware/auth.js
module.exports = function (req, res, next) {
  // Ví dụ: kiểm tra header Authorization
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // TODO: validate token
  // Nếu hợp lệ:
  // req.user = decodedUser;
  next();
};
