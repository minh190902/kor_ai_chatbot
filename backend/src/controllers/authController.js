const { v4: uuidv4 } = require('uuid');
const storage = require('../services/storageService');

/**
 * POST /api/login
 * Body: { username }
 * Response: { user_id }
 */
exports.login = async (req, res) => {
  const { username } = req.body;
  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Username is required' });
  }

  // Kiểm tra user đã tồn tại chưa (giả sử lưu trong conversations hoặc users)
  let user = storage.findUserByUsername
    ? storage.findUserByUsername(username)
    : null;

  if (!user) {
    // Nếu chưa có, tạo mới user
    user = { id: uuidv4(), username };
    if (storage.createUser) {
      storage.createUser(user);
    } else {
      // Nếu chưa có hàm createUser, có thể lưu vào conversations hoặc nơi khác
      // Hoặc chỉ trả về user_id ngẫu nhiên
    }
  }

  res.json({ user_id: user.id || uuidv4() });
};