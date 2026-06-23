"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import "./_loginModal.scss";

export const LoginModal = ({ onClose, onSwitchToRegister }) => {
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <button className="modal-box__close" onClick={onClose}>✕</button>
        <h2 className="modal-box__title">Login to your account</h2>

        {error && (
          <p style={{ color: "red", fontSize: "14px", marginBottom: "12px" }}>
            {error}
          </p>
        )}

        <div className="modal-box__fields">
          <input
            className="modal-box__input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="modal-box__input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="modal-box__row">
          <label className="modal-box__remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember me</span>
          </label>
          <button className="modal-box__forgot">Forgot Password?</button>
        </div>

        <button
          className="modal-box__submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="modal-box__switch">
          New to Rishta.pk?{" "}
          <button onClick={onSwitchToRegister}>Register Now</button>
        </p>

      </div>
    </div>
  );
};