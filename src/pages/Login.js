import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/authService";
import "./Login.css";
import Swal from "sweetalert2";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const logindata = {
      mobileNumber: email,
      emailId: email,
      password: pwd,
    };

    const res = await loginAdmin(logindata);

    if (res.statusCode !== 200) {
      Swal.fire("Error", res.message, "error");
      return;
    }

    // Save adminId for OTP verification
    localStorage.setItem("adminId", res.data.adminId);

    Swal.fire({
      icon: "success",
      title: "OTP Sent",
      text: "Please verify OTP",
      timer: 1500,
      showConfirmButton: false,
    });
    navigate("/admin-otp");

  } catch (error) {
    Swal.fire("Error", "Login failed", "error");
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

          <label>Email/Mobile Number</label>
          <input
            type="text"
            placeholder="Email/Mobile Number"
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
