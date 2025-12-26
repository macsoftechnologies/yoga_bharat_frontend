import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/authService";
import "./Login.css";
import Swal from "sweetalert2";

export default function Login() {
  const navigate = useNavigate();

  // State for form inputs
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // Handle login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const logindata = {
        emailId: email,
        password: pwd,
      };

      const res = await loginAdmin(logindata);

      if (res.statusCode !== 200) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: res.message || "Email or Password is incorrect",
        });
        return;
      }

      // Save token and admin data
      localStorage.setItem("token", res.token);
      localStorage.setItem("admin", JSON.stringify(res.data));

      // Navigate to dashboard
      navigate("/dashboard", { replace: true });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: error.response?.data?.message || "Something went wrong. Try again!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <form onSubmit={handleLogin}>
          <div className="card-logo">
            <img src="/Yoga-icon-01.png" alt="Yoga Bharat" className="logo" />
          </div>

          <h4 className="login-title">Login to Dashboard</h4>

          <label>Email</label>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="********"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />

          <div className="remember">
            <span
              className="forgot-link"
              onClick={() => navigate("/admin-forgot-password")}
            >
              Forgot password?
            </span>
          </div>

          <button className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}
