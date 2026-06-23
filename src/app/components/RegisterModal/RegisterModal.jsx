"use client";

import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import "./_registerModal.scss";

const profileForOptions = [
  "Myself", "My Son", "My Daughter",
  "My Brother", "My Sister", "My Relative", "My Friend",
];

export const RegisterModal = ({ onClose, onSwitchToLogin }) => {
  const [profileFor, setProfileFor] = useState("");
  const [email,      setEmail]      = useState("");
  const [phone,      setPhone]      = useState("");
  const [password,   setPassword]   = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone,
          profile_for: profileFor,
        }
      }
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Account created successfully! You can now log in.");
    setTimeout(() => {
      onSwitchToLogin();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <button className="modal-box__close" onClick={onClose}>✕</button>
        <h2 className="modal-box__title">Register and find your soulmate</h2>

        {error && (
          <p style={{ color: "red", fontSize: "14px", marginBottom: "12px" }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: "green", fontSize: "14px", marginBottom: "12px" }}>
            {success}
          </p>
        )}

        <div className="modal-box__fields">
          <div className="modal-box__select-wrap">
            <select
              required
              value={profileFor}
              onChange={(e) => setProfileFor(e.target.value)}
              className="modal-box__select"
            >
              <option value="" disabled hidden>Create Profile for</option>
              {profileForOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <input
            className="modal-box__input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="modal-box__phone-row">
            <span className="modal-box__country-code">🇵🇰 +92</span>
            <input
              className="modal-box__input modal-box__input--phone"
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <input
            className="modal-box__input"
            type="password"
            placeholder="Create Password"