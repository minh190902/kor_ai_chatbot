const bcrypt = require('bcrypt');
const { User } = require('../db/models');

async function register(username, password) {
  const existing = await User.findOne({ where: { username } });
  if (existing) return { exists: true };
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hash });
  return { user };
}

async function login(username, password) {
  const user = await User.findOne({ where: { username } });
  if (!user) return { invalid: true };
  const match = await bcrypt.compare(password, user.password);
  if (!match) return { invalid: true };
  return { user };
}

module.exports = { register, login };