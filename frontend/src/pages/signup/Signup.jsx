import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Label, TextInput, Alert } from "flowbite-react";
import axiosInstance from "../../utils/axiosInstance";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cf_handle, set_cf_handle] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/user/register", {
        username,
        email,
        name,
        password,
        cf_handle,
        phone,
      });
  
      if (response.status === 201) {
        setSuccess("Account created successfully! Please log in."); // shit
        navigate("/login");
      }
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Failed to create an account.");
      } else {
        setError("Failed to create an account. Please try again.");
      }
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6">Signup</h2>
      {error && <Alert color="failure">{error}</Alert>}
      {success && <Alert color="success">{success}</Alert>}
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
      <div>
          <Label htmlFor="name" value="name" />
          <TextInput
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
          <Label htmlFor="email" value="Email" />
          <TextInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="cf_handle" value="Codeforces Handle (username)" />
          <TextInput
            id="cf_handle"
            type="text"
            value={cf_handle}
            onChange={(e) => set_cf_handle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone" value="Phone" />
          <TextInput
            id="phone"
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
        <Button type="submit" color="indigo">
          Signup
        </Button>
        <Link to="/login">Already have an Account?</Link>
      </form>
    </div>
  );
};

export default Signup;
