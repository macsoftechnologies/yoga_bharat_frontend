import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <div className="logo-box">Yoga Bharat</div>

        <label>Email</label>
        <input type="email" placeholder="your@email.com"
          value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" placeholder="your password"
          value={pwd} onChange={(e) => setPwd(e.target.value)} required />

        <div className="remember">
          <input type="checkbox" /> Remember me
        </div>

        <button type="submit" className="login-btn">Login</button>

        <p className="or">or</p>
        <a className="signup">Signup</a>
      </form>
    </div>
  );
}
