import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Label } from "flowbite-react";
import { TextInput } from "flowbite-react";
import { Button } from "flowbite-react";
import { Alert } from "flowbite-react";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password });
      navigate('/explore');
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setError(err.response?.data.message || 'Login failed.');
    }
  };
  
      
  
    return (
      <div className="max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        {error && <Alert color="failure">{error}</Alert>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="username" value="Username" />
            <TextInput
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password" value="Password" />
            <TextInput
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" color="indigo">Login</Button>
        </form>
      </div>
    );
  };
  
  export default Login;
  