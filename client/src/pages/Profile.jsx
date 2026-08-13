import React, { useState } from "react";
import { message } from "antd";
import { useAuth } from "../context/AuthContext.jsx";
import { updateProfile } from "../api/authService.js";
import "./Auth.scss";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { user: updated } = await updateProfile(form);
      setUser(updated);
      localStorage.setItem("luxestride_user", JSON.stringify(updated));
      message.success("Profile updated");
    } catch (err) {
      message.error(err.response?.data?.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg" />
      <div className="auth-card glass-panel">
        <span className="eyebrow">Account</span>
        <h1 className="font-display">My Profile</h1>
        <p className="auth-card__sub">{user?.email}</p>

        <form className="form-luxe" onSubmit={handleSubmit}>
          <label>Full Name</label>
          <div className="input-icon">
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <label>Phone</label>
          <div className="input-icon">
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Not set" />
          </div>

          <label>Address</label>
          <div className="input-icon">
            <input name="address" value={form.address} onChange={handleChange} placeholder="Not set" />
          </div>

          <button className="btn-luxe-solid auth-submit" disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
