import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Todos from './pages/Todos';
import Accounts from './pages/Account';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/auth" />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/auth">Authentication</Link> |{" "}
        <Link to="/todos">Todos</Link> |{" "}
        <Link to="/accounts">Accounts</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/todos" element={<ProtectedRoute><Todos /></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;