"use client";

import React from "react";
import { useModal } from "../components/context/ModalContext";
import "./_profileCreated.scss";

export default function ProfileCreatedPage() {
  const { openLogin } = useModal();

  return (
    <div className="profile-created">
      <div className="profile-created__inner">
        <div className="profile-created__icon">✅</div>
        <h1 className="profile-created__title">Your Profile is Ready!</h1>
        <p className="profile-created__text">
          Thank you for completing your profile. Please login to start browsing profiles and connecting with potential matches.
        </p>
        <button className="profile-created__btn" onClick={openLogin}>
          Login to Continue
        </button>
      </div>
    </div>
  );
}