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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Account Profile</h2>
      
      <div>
        <div>
          <span>User ID</span>
          <span>{user?.id}</span>
        </div>

        <div>
          <span>Username</span>
          <span>{user?.username}</span>
        </div>

        <div>
          <span>Email Address</span>
          <span>{user?.email}</span>
        </div>
      </div>

      <button 
        onClick={handleLogout}
      >
        Sign Out
      </button>
    </div>
  );
}

export default Account;