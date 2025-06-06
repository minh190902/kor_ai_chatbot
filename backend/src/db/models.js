const { DataTypes, Model } = require('sequelize');
const sequelize = require('./sequelize');

class User extends Model {}
User.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  last_active: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.STRING, defaultValue: 'ACTIVE' },
  user_metadata: { type: DataTypes.JSONB, defaultValue: {} },
}, { sequelize, modelName: 'user', timestamps: false });

class ChatSession extends Model {}
ChatSession.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  user_id: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING },
  started_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  ended_at: { type: DataTypes.DATE },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  llm_context: { type: DataTypes.JSONB, defaultValue: {} },
  session_metrics: { type: DataTypes.JSONB, defaultValue: {} },
}, { sequelize, modelName: 'chat_session', timestamps: false });

class Message extends Model {}
Message.init({
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  session_id: { type: DataTypes.UUID, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  level: { type: DataTypes.STRING, allowNull: true },
  message_metadata: { type: DataTypes.JSONB, defaultValue: {} },
}, { sequelize, modelName: 'message', timestamps: false });

User.hasMany(ChatSession, { foreignKey: 'user_id' });
ChatSession.belongsTo(User, { foreignKey: 'user_id' });
ChatSession.hasMany(Message, { foreignKey: 'session_id' });
Message.belongsTo(ChatSession, { foreignKey: 'session_id' });

module.exports = { sequelize, User, ChatSession, Message };