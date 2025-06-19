const authService = require('../services/authService');
const response = require('../utils/response');

async function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return response.error(res, 'Username and password are required', 400);

  try {
    const result = await authService.register(username, password);
    if (result.exists) return response.error(res, 'Username already exists', 409);
    const { user } = result;
    response.success(res, { user_id: user.id, username: user.username, role: user.role }, 201);
  } catch (err) {
    response.error(res, 'Internal server error');
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return response.error(res, 'Username and password are required', 400);

  try {
    const result = await authService.login(username, password);
    if (result.invalid) return response.error(res, 'Invalid username or password', 401);
    const { user } = result;
    response.success(res, { user_id: user.id, username: user.username, role: user.role });
  } catch (err) {
    response.error(res, 'Internal server error');
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'email', 'role', 'status', 'created_at']
    });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, ...user.toJSON() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { register, login, getUserById };