export const searchConversations = async ({ userId, q, from, to }) => {
  const params = new URLSearchParams({ user_id: userId });
  if (q) params.append('q', q);
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  const res = await fetch(`/api/conversations/search?${params.toString()}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
};