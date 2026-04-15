import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  // Use state so React knows when to re-render
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleAuthChange = () => {
      setAuth(!!localStorage.getItem('token'));
    };

    // Listen for our custom event
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="#" className="nav-logo">
          justodit <span className="logo-icon">✔️</span>
        </Link>
        
        <div className="nav-links">
          {auth ? (
            <>
              <Link to="/todos" className="nav-item">My Todos</Link>
              <Link to="/account" className="nav-item nav-account">Account</Link>
            </>
          ) : (
            <>
              <Link to="/auth" className="nav-item">Login</Link>
              <Link to="/auth" className="nav-btn">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;