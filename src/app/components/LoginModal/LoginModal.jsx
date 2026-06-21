"use client";

import React, { useState } from "react";
import "./_loginModal.scss";

export const LoginModal = ({ onClose, onSwitchToRegister }) => {
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = () => {
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <button className="modal-box__close" onClick={onClose} aria-label="Close">✕</button>

        <h2 className="modal-box__title">Login to your account</h2>

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

        <button className="modal-box__submit" onClick={handleSubmit}>Login</button>

        <p className="modal-box__switch">
          New to Rishta.pk?{" "}
          <button onClick={onSwitchToRegister}>Register Now</button>
        </p>

      </div>
    </div>
  );
};