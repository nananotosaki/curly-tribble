import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserData } from '../services/userService';

function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserData();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user", err);
        // If the token is expired or invalid, boot them to login
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Account Profile</h2>
      
      <div className="space-y-4">
        <div className="flex flex-col border-b pb-2">
          <span className="text-sm text-gray-500 uppercase font-semibold">User ID</span>
          <span className="text-lg font-mono text-blue-600">{user?.id}</span>
        </div>

        <div className="flex flex-col border-b pb-2">
          <span className="text-sm text-gray-500 uppercase font-semibold">Username</span>
          <span className="text-lg text-gray-800">{user?.username}</span>
        </div>

        <div className="flex flex-col border-b pb-2">
          <span className="text-sm text-gray-500 uppercase font-semibold">Email Address</span>
          <span className="text-lg text-gray-800">{user?.email}</span>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Sign Out
      </button>
    </div>
  );
}

export default Account;