const { DataTypes, Model } = require('sequelize');
const sequelize = require('./sequelize');

// -------------------- USER --------------------
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
  role: { type: DataTypes.STRING, defaultValue: 'user' },
  avatar_url: { type: DataTypes.STRING },
  login_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  last_plan_id: { type: DataTypes.UUID, allowNull: true }
}, { sequelize, modelName: 'user', timestamps: false });

// -------------------- CHAT SESSION --------------------
class ChatSession extends Model {}
ChatSession.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  user_id: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING },
  started_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  ended_at: { type: DataTypes.DATE },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  llm_context: { type: DataTypes.JSONB, defaultValue: {} },
  session_metadata: { type: DataTypes.JSONB, defaultValue: {} },
  session_metrics: { type: DataTypes.JSONB, defaultValue: {} }
}, { sequelize, modelName: 'chat_session', timestamps: false });

// -------------------- MESSAGE --------------------
class Message extends Model {}
Message.init({
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  session_id: { type: DataTypes.UUID, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  level: { type: DataTypes.STRING, allowNull: true },
  message_metadata: { type: DataTypes.JSONB, defaultValue: {} },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  reply_to_message_id: { type: DataTypes.BIGINT, allowNull: true },
  sentiment_score: { type: DataTypes.INTEGER, allowNull: true }
}, { sequelize, modelName: 'message', timestamps: false });

// -------------------- LEARNING PLAN --------------------
class LearningPlan extends Model {}
LearningPlan.init({
  plan_id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  user_id: { type: DataTypes.UUID, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'processing' }, // processing, done, failed
  learning_plan: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  error_message: { type: DataTypes.TEXT },
  plan_type: { type: DataTypes.STRING }, // ai/manual/imported
  progress_notes: { type: DataTypes.TEXT },
  last_accessed: { type: DataTypes.DATE }
}, { sequelize, modelName: 'learning_plan', timestamps: false });

class StudyPlanContent extends Model {}
StudyPlanContent.init({
  study_plan_id: { type: DataTypes.UUID, primaryKey: true },
  content_json: { type: DataTypes.JSONB, allowNull: false },
  content_hash: { type: DataTypes.STRING(64) }
}, { sequelize, modelName: 'study_plan_content', timestamps: false });


// -------------------- RELATIONSHIPS --------------------
// User - ChatSession
User.hasMany(ChatSession, { foreignKey: 'user_id', as: 'chat_sessions' });
ChatSession.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ChatSession - Message
ChatSession.hasMany(Message, { foreignKey: 'session_id', as: 'messages' });
Message.belongsTo(ChatSession, { foreignKey: 'session_id', as: 'session' });

// User - LearningPlan (chỉ định rõ foreignKey)
User.hasMany(LearningPlan, { foreignKey: 'user_id', as: 'learning_plans' });
LearningPlan.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

StudyPlanContent.belongsTo(LearningPlan, { foreignKey: 'study_plan_id', targetKey: 'plan_id' });
LearningPlan.hasOne(StudyPlanContent, { foreignKey: 'study_plan_id', sourceKey: 'plan_id' });


// last_plan_id là reference tới LearningPlan
User.belongsTo(LearningPlan, { foreignKey: 'last_plan_id', as: 'last_plan' });

// -------------------- EXPORT --------------------
module.exports = { sequelize, User, ChatSession, Message, LearningPlan };