const { User } = require('../db/models');

async function deleteUser(req, res) {
  const userId = req.params.id;
  if (!userId) return res.status(400).json({ error: 'User ID is required' });

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
    deleteUser
}