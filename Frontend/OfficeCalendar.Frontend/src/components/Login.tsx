import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5267/api/Auth/login", {
        username,
        password,
      });

      if (response.data.success) {
        setMessage(`✅ Login successful! Role: ${response.data.role}`);
        navigate("/dashboard"); // Redirect here
      } else {
        setMessage("❌ Login failed: " + response.data.message);
      }
    } catch (error: any) {
      setMessage("❌ Error: " + (error.response?.data?.message || "server error"));
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
