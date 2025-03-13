import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        console.log('Logging in...');
        const res = await axios.post(
            'http://localhost:5000/api/users/login',
            { email, password }, // Sending as JSON
            { headers: { 'Content-Type': 'application/json' } } // Explicitly setting JSON content type
        );

        // Print the full response object
        console.log("Full Response:", res);

        // Print only the response data
        console.log("Response Data:", res.data);
  
        if (res.data.token) {
            login(res.data.token);
            navigate('/products', { replace: true }); // Navigate to /products page upon login
        } else {
            alert('Login failed. No token received.');
        }
    } catch (err) {
      alert('Login failed! Check credentials.');
      console.error('Login error:', err);
    }
  };  
  
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
