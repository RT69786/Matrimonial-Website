"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useModal } from "../context/ModalContext";
import "./_ctaBanner.scss";

const CTABanner = () => {
  const { openRegister, user } = useModal();
  const router = useRouter();

  const handleClick = () => {
    if (user) {
      router.push("/create-profile");
    } else {
      openRegister();
    }
  };

  return (
    <div className="cta-banner">
      <section className="for-center-cta-banner">
        <h2>Ready to Find Your Life Partner?</h2>
        <p>
          Join our growing community and start your journey toward a meaningful
          and lasting relationship.
        </p>
        <button className="cta-btn" onClick={handleClick}>
          Create Free Profile
        </button>
      </section>
    </div>
  );
};

export default CTABanner;
