import { Database } from 'lucide-react';

const AdminCleanup = ({ cleanupDays, setCleanupDays, cleanupConversations, loading }) => (
  <div className="bg-white rounded-lg shadow mb-8">
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Dọn dẹp dữ liệu</h2>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Xóa hội thoại cũ hơn:</label>
          <input
            type="number"
            value={cleanupDays}
            onChange={e => setCleanupDays(parseInt(e.target.value) || 90)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
            min="1"
          />
          <span className="text-sm text-gray-600">ngày</span>
        </div>
        <button
          onClick={cleanupConversations}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 transition-colors"
        >
          <Database className="h-4 w-4" />
          <span>{loading ? 'Đang xử lý...' : 'Cleanup'}</span>
        </button>
      </div>
    </div>
  </div>
);

export default AdminCleanup;