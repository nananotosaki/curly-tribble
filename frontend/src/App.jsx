import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Todos from './pages/Todos';
import Accounts from './pages/Account';
import Navbar from './components/Navbar';


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
      <Navbar>
        <Link to="/auth">Authentication</Link> |{" "}
        <Link to="/todos">Todos</Link> |{" "}
        <Link to="/account">Accounts</Link>
      </Navbar>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/todos" element={<ProtectedRoute><Todos /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;