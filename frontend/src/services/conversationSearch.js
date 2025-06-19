export const searchConversations = async ({ userId, q, from, to }) => {
  const res = await fetch(`/api/conversations/search?user_id=${userId}&q=${q}&from=${from}&to=${to}`);
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Không thể tìm kiếm');
  return json.data;
};