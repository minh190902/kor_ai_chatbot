// -------------------------------------------------------------------------------------
// Chat API Service
// -------------------------------------------------------------------------------------

export const fetchConversations = async (apiEndpoint, userId) => {
  const res = await fetch(`${apiEndpoint}/api/conversations?user_id=${userId}`);
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Không thể tải cuộc trò chuyện');
  return json.data;
};

export const createConversation = async (apiEndpoint, title, userId) => {
  const res = await fetch(`${apiEndpoint}/api/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, user_id: userId }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Không thể tạo cuộc trò chuyện');
  return json.data;
};

export const deleteConversation = async (apiEndpoint, sessionId) => {
  const res = await fetch(`${apiEndpoint}/api/conversations/${sessionId}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Không thể xóa cuộc trò chuyện');
  return json.data;
};

export const deleteMessagesInConversation = async (apiEndpoint, sessionId) => {
  const res = await fetch(`${apiEndpoint}/api/conversations/${sessionId}/messages`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Không thể xóa tin nhắn');
  return json.data;
};

export const fetchMessages = async (apiEndpoint, sessionId) => {
  const res = await fetch(`${apiEndpoint}/api/conversations/${sessionId}/messages`);
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Không thể tải tin nhắn');
  return json.data;
};

export const sendChatMessage = async (apiEndpoint, payload) => {
  const res = await fetch(`${apiEndpoint}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Không thể gửi yêu cầu chat');
  return json.data;
};

export const fetchContextInfo = async (apiEndpoint, sessionId) => {
  const res = await fetch(`${apiEndpoint}/api/context/${sessionId}/preview`);
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Không thể lấy context');
  return json.data;
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


// -------------------------------------------------------------------------------------
// AI Learning Planning API Service
// -------------------------------------------------------------------------------------
export const fetchLearningPlan = async (apiEndpoint, payload) => {
  const res = await fetch(`${apiEndpoint}/api/learning-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Không thể tạo kế hoạch học tập');
  return json.data;
};

export const fetchLearningPlanDetail = async (planId) => {
  const res = await fetch(`/api/learning-plan/${planId}`);
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Không thể tải kế hoạch học tập');
  return json.data;
};