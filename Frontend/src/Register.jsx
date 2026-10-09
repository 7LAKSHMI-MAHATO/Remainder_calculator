
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      // Redirect to Login after successful registration
      navigate("/login", {
        state: {
          message: "Registration successful! Please log in.",
        },
      });
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message || "Registration failed."
        );
      } else {
        setError("Unable to connect to the server.");
      }
    }
  };

  return (
    <div>
      <h2>Create Account</h2>

      <form onSubmit={handleRegister}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}

export default Register;