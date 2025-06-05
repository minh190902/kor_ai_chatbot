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

  // Check exist user in storage
  let user = storage.findUserByUsername
    ? storage.findUserByUsername(username)
    : null;

  if (!user) {
    // If user not found, create a new user
    user = { id: uuidv4(), username };
    if (storage.createUser) {
      storage.createUser(user);
    } else {

    }
  }

  res.json({ user_id: user.id || uuidv4() });
};