import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { FaEye, FaEyeSlash} from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import "./Auth.scss";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      message.error("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    try {
      const user = await register(form);
      message.success(`Account created — welcome, ${user.name.split(" ")[0]}`);
      navigate("/");
    } catch (err) {
      message.error(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg" />
      <div className="auth-card glass-panel reveal is-visible">
        <span className="eyebrow">Join Us</span>
        <h1 className="font-display">Create Account</h1>
        <p className="auth-card__sub">A few details and you're in.</p>

        <form className="form-luxe" onSubmit={handleSubmit}>
          <label>Full Name</label>
          <div className="input-icon">
            <FiUser />
            <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Enter your full name" />
          </div>

          <label>Email</label>
          <div className="input-icon">
            <FiMail />
            <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="Enter your email" />
          </div>

          <label>Password</label>
          <div className="input-icon">
            <FiLock />
            <input type={ showPassword ? "text" : "password"} name="password" required value={form.password} onChange={handleChange} placeholder="At least 6 characters" onFocus={() => {setIsFocused(true)}} onBlur={() => {setIsFocused(false)}} />
            {(isFocused && form.password.length > 0) && (<span className="password-toggle" onMouseDown={(e) => {e.preventDefault() ; setShowPassword(!showPassword)}}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span> )}
          </div>

          <button className="btn-luxe-solid auth-submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="auth-card__switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
