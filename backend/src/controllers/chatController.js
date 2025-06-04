const { ChatSession, Message, User } = require('../db/models');
const aiService = require('../services/aiService');

exports.handleChat = async (req, res) => {
  const { user_id, session_id, message, settings = {} } = req.body;
  if (!user_id || !session_id || !message) {
    return res.status(400).json({ error: 'user_id, session_id, and message are required' });
  }

  try {
    // 1. Đảm bảo user và session tồn tại
    let user = await User.findByPk(user_id);
    if (!user) user = await User.create({ id: user_id, username: `user_${user_id}` });

    let session = await ChatSession.findByPk(session_id);
    if (!session) session = await ChatSession.create({ id: session_id, user_id, title: 'Cuộc trò chuyện mới' });

    // 2. Lưu message user vào DB
    await Message.create({
      session_id,
      role: 'USER',
      content: message,
      timestamp: new Date()
    });

    // 3. Lấy history từ DB (ví dụ 20 message gần nhất)
    const history = await Message.findAll({
      where: { session_id },
      order: [['timestamp', 'ASC']],
      limit: 20
    });

    // 4. Gọi AI Python, chỉ truyền history và message
    const aiResponse = await aiService.callChatAPI({
      user_id,
      session_id,
      message,
      history: history.map(m => ({ role: m.role, content: m.content }))
    });

    // 5. Lưu message AI vào DB
    await Message.create({
      session_id,
      role: 'ASSISTANT',
      content: aiResponse,
      timestamp: new Date()
    });

    // 6. Trả về response cho frontend
    res.json({ response: aiResponse, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process chat', detail: err.message });
  }
};