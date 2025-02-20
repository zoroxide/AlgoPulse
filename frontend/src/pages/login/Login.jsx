import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Label } from "flowbite-react";
import { TextInput } from "flowbite-react";
import { Button } from "flowbite-react";
import { Alert } from "flowbite-react";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/user/login', { email, password });
      login(response.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
      // console.error('Error logging in:', err);
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      {error && <Alert color="failure">{error}</Alert>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email" value="E-mail" />
          <TextInput
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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