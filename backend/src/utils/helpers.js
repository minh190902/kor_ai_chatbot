// src/utils/helpers.js

/**
 * Sắp xếp mảng theo trường `updatedAt` giảm dần
 */
function sortByUpdatedAtDesc(items) {
  return items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

/**
 * Tạo title tắt nếu message quá dài
 */
function generateTitleFromMessage(message = '', maxLength = 50) {
  if (message.length <= maxLength) return message;
  return message.slice(0, maxLength) + '...';
}

module.exports = {
  sortByUpdatedAtDesc,
  generateTitleFromMessage,
};
