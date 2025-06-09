import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import AdminStats from './AdminStats';
import AdminCleanup from './AdminCleanup';
import AdminUserTable from './AdminUserTable';
import useLogout from '../auth/logout';

const AdminDashboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0 });
  const [cleanupDays, setCleanupDays] = useState(90);
  const [searchTerm, setSearchTerm] = useState('');
  const handleLogout = useLogout(onLogout);

  // Fetch users list
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users`, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setStats({
          totalUsers: data.length,
          activeUsers: data.filter(u => u.status === 'ACTIVE').length
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa user này?')) return;
    
    try {
      const response = await fetch(`/api/admin/delete-user/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId));
        alert('Xóa user thành công!');
      } else {
        alert('Lỗi khi xóa user!');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Lỗi khi xóa user!');
    }
  };

  // Cleanup old conversations
  const cleanupConversations = async () => {
    if (!confirm(`Bạn có chắc chắn muốn xóa các cuộc hội thoại cũ hơn ${cleanupDays} ngày?`)) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/cleanup?days=${cleanupDays}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(result.message);
      } else {
        alert('Lỗi khi cleanup!');
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
      alert('Lỗi khi cleanup!');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader username={user.username} onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminStats stats={stats} />
        <AdminCleanup
          cleanupDays={cleanupDays}
          setCleanupDays={setCleanupDays}
          cleanupConversations={cleanupConversations}
          loading={loading}
        />
        <AdminUserTable
          users={users}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          deleteUser={deleteUser}
          fetchUsers={fetchUsers}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;