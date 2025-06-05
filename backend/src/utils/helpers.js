/**
 * Sort an array of items by their updatedAt field in descending order
 */
function sortByUpdatedAtDesc(items) {
  return items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

/**
 * Create a title from a message, truncating if necessary
 */
function generateTitleFromMessage(message = '', maxLength = 50) {
  if (message.length <= maxLength) return message;
  return message.slice(0, maxLength) + '...';
}

module.exports = {
  sortByUpdatedAtDesc,
  generateTitleFromMessage,
};
