"use client";

import React from "react";
import { useModal } from "../context/ModalContext";
import "./_ctaBanner.scss";

const CTABanner = () => {
  const { openRegister } = useModal();

  return (
    <div className="cta-banner">
      <section className="for-center-cta-banner">
        <h2>Ready to Find Your Life Partner?</h2>
        <p>Join our growing community and start your journey toward a meaningful and lasting relationship.</p>
        <button className="cta-btn" onClick={openRegister}>
          Create Free Profile
        </button>
      </section>
    </div>
  );
};

export default CTABanner;