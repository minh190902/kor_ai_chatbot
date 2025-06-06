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

export const sendChatMessageStream = async (apiEndpoint, payload, onChunk) => {
  const res = await fetch(`${apiEndpoint}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, stream: true }),
  });
  if (!res.ok || !res.body) throw new Error('Không thể gửi yêu cầu chat (stream)');

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Xử lý từng dòng data: {...}
    let lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'chunk' && data.content) {
            onChunk(data.content);
          }
        } catch (e) {
          // ignore parse error
        }
      }
    }
  }
};