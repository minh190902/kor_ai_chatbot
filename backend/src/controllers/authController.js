const bcrypt = require('bcrypt');
const { User } = require('../db/models');

/**
 * POST /api/register
 * Body: { username, password }
 */
exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

  try {
    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(409).json({ error: 'Username already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash });
    res.status(201).json({ user_id: user.id, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/login
 * Body: { username, password }
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid username or password' });

    // TODO: Trả về JWT token nếu muốn bảo mật hơn
    res.json({ user_id: user.id, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};