import { Database, LogOut } from 'lucide-react';

const AdminHeader = ({ username, onLogout }) => (
  <div className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-4">
          <Database className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Quản lý hệ thống AI Chat</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Xin chào, {username}</span>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AdminHeader;