import { Link } from 'react-router-dom';

function Navbar() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-tighter hover:text-blue-400">
          DoneDeal <span className="text-sm">🏴‍☠️</span>
        </Link>
        
        <div className="space-x-6">
          {isAuthenticated ? (
            <>
              <Link to="/todos" className="hover:text-blue-400 transition">My Todos</Link>
              <Link to="/account" className="hover:text-blue-400 transition font-medium border-l pl-6 border-slate-700">Account</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400">Login</Link>
              <Link to="/register" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}