import { Users, Calendar } from 'lucide-react';

const AdminStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <Users className="h-8 w-8 text-blue-600" />
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Tổng Users</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <Users className="h-8 w-8 text-green-600" />
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Users Hoạt động</p>
          <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <Calendar className="h-8 w-8 text-purple-600" />
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Hôm nay</p>
          <p className="text-2xl font-bold text-gray-900">{new Date().toLocaleDateString('vi-VN')}</p>
        </div>
      </div>
    </div>
  </div>
);

export default AdminStats;