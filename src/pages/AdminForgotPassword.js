import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { adminForgotPassword } from "../services/authService";
import "./Login.css";

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Email and new password are required",
      });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        mobileNumber: email,
        emailId: email,
        password: password,
      };

      const res = await adminForgotPassword(payload);

      if (res.statusCode !== 200) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: res.message || "Password update failed",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "Please login with your new password",
      });

      navigate("/admin", { replace: true });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page container-fluid">
      <div className="row justify-content-center align-items-center vh-100">
          <div className="login-card p-4">
            
            <div className="card-logo">
              <img src="/Yoga-icon-01.png" alt="Yoga Bharat" className="logo" />
            </div>

            <h4 className="login-title text-center">
              Admin Forgot Password
            </h4>

            <form onSubmit={handleForgotPassword}>
              <label>Email/Mobile Number</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                className="login-btn mt-3"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>

          </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
