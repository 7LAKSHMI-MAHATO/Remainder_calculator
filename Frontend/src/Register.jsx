import { useState } from "react";
import api from "./api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password
      });

      setMessage(response.data.message);

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
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
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit">
          Register
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default Register;