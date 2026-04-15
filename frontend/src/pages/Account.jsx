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
    window.dispatchEvent(new Event('authChange'));
    navigate('/auth');
  };

  if (loading) return <div>Loading...</div>;

  // Account.jsx
  return (
    <div className="account-container">
      <div className="account-card">
        <h2>Account Profile</h2>
        
        <div className="profile-details">
          <div className="profile-row">
            <span className="label">User ID</span>
            <span className="value">{user?.id}</span>
          </div>

          <div className="profile-row">
            <span className="label">Username</span>
            <span className="value">{user?.username}</span>
          </div>

          <div className="profile-row">
            <span className="label">Email Address</span>
            <span className="value">{user?.email}</span>
          </div>
        </div>

        <button 
          className="btn-logout"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Account;