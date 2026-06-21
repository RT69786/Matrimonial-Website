"use client";

import React, { useState } from "react";
import "./_registerModal.scss";

const profileForOptions = [
  "Myself",
  "My Son",
  "My Daughter",
  "My Brother",
  "My Sister",
  "My Relative",
  "My Friend",
];

export const RegisterModal = ({ onClose, onSwitchToLogin }) => {
  const [profileFor, setProfileFor] = useState("");
  const [email,      setEmail]      = useState("");
  const [phone,      setPhone]      = useState("");
  const [password,   setPassword]   = useState("");

  const handleSubmit = () => {
    console.log({ profileFor, email, phone, password });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <button className="modal-box__close" onClick={onClose} aria-label="Close">✕</button>

        <h2 className="modal-box__title">Register and find your soulmate</h2>

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        </div>

        <button className="modal-box__submit" onClick={handleSubmit}>
          Register for free
        </button>

        <p className="modal-box__switch">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin}>Login</button>
        </p>

      </div>
    </div>
  );
};