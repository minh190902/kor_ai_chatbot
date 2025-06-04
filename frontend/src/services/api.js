export const fetchConversations = async (apiEndpoint, userId) => {
  const res = await fetch(`${apiEndpoint}/api/conversations?user_id=${userId}`);
  if (!res.ok) throw new Error('Không thể tải cuộc trò chuyện');
  return res.json(); // [{ id, title, ... }]
};

export const createConversation = async (apiEndpoint, title, userId) => {
  const res = await fetch(`${apiEndpoint}/api/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, user_id: userId }),
  });
  if (!res.ok) throw new Error('Không thể tạo cuộc trò chuyện');
  return res.json();
};

export const fetchMessages = async (apiEndpoint, sessionId) => {
  const res = await fetch(`${apiEndpoint}/api/conversations/${sessionId}/messages`);
  if (!res.ok) throw new Error('Không thể tải tin nhắn');
  return res.json();
};

export const sendChatMessage = async (apiEndpoint, payload) => {
  const res = await fetch(`${apiEndpoint}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Không thể gửi yêu cầu chat');
  return res.json();
};