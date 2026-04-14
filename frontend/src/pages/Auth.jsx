import { useState } from 'react';
import {login, register} from '../services/authService';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const data = await login(email, password);
        localStorage.setItem('token', data.accessToken);
        navigate('/todos');
    } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
    }
  };
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
        await register(username, email, password);
        const data = await login(email, password);
        localStorage.setItem('token', data.accessToken);
        navigate('/todos');
    } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      
      {isLogin ? (
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          {error && <p>{error}</p>}
        </form>
        
      ) : (
        <form onSubmit={handleRegisterSubmit}>
          <input 
            type="text" 
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Register</button>
          {error && <p>{error}</p>}
        </form>
      )}

      <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
    </div>
  );
}

export default Auth;