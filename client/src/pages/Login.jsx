import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { message } from "antd";
import { FiMail, FiLock } from "react-icons/fi";
import { FaEye, FaEyeSlash} from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import "./Auth.scss";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(form);
      message.success(`Welcome back, ${user.name.split(" ")[0]}`);
      navigate(user.role === "admin" ? "/admin" : from, { replace: true });
    } catch (err) {
      message.error(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg" />
      <div className="auth-card glass-panel reveal is-visible">
        <span className="eyebrow">Welcome Back</span>
        <h1 className="font-display">Sign In</h1>
        <p className="auth-card__sub">Enter your details to access your account.</p>

        <form className="form-luxe" onSubmit={handleSubmit}>
          <label>Email</label>
          <div className="input-icon">
            <FiMail />
            <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="Enter your email" />
          </div>

          <label>Password</label>
          <div className="input-icon">
            <FiLock />
            <input type={ showPassword ? "text" : "password"} name="password" required value={form.password} onChange={handleChange} placeholder="••••••••" onFocus={() => {setIsFocused(true)}} onBlur={() => {setIsFocused(false)}} />
            {(isFocused && form.password.length > 0) && (<span className="password-toggle" onMouseDown={(e) => {e.preventDefault() ; setShowPassword(!showPassword)}}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span> )}
          </div>

          <button className="btn-luxe-solid auth-submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-card__switch">
          New to LuxeStride? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}


