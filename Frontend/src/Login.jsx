
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("Login successful!");

      navigate("/");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Login failed.");
      } else {
        setError("Unable to connect to the server.");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Log in to your RemainderCalc account.</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="calculate-btn">
            Login
          </button>
        </form>

        {message && <p>{message}</p>}
        {error && <p className="error">{error}</p>}

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>

        <Link to="/">Back to Calculator</Link>
      </div>
    </div>
  );
}

export default Login;