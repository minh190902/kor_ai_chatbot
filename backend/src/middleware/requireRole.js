const { User } = require('../db/models');

module.exports = function(requiredRole) {
  return async (req, res, next) => {
    const userId = req.body.user_id || req.query.user_id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await User.findByPk(userId);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (user.role !== requiredRole) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }
    next();
  };
};