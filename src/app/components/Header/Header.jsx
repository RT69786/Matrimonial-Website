"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useModal } from "../context/ModalContext";
import "./_header.scss";

const Header = () => {
  const { openRegister } = useModal();
  const router = useRouter();

  return (
    <header className="header">
      <video autoPlay loop muted playsInline preload="auto" className="header__video">
        <source src="/videos/home-hero.webm" type="video/webm" />
        <source src="/videos/home-hero.mp4"  type="video/mp4" />
      </video>

      <section className="for-center-header">
        <h1 className="h1">Find Your Perfect Life Partner</h1>
        <h2 className="h2">
          Join a trusted community of verified profiles and start your journey toward marriage
        </h2>

        <div className="button-div">
          <button className="btn-1" onClick={openRegister}>Register Free</button>
          <button className="btn-2" onClick={() => router.push("/browse")}>Browse Profile</button>
        </div>
      </section>
    </header>
  );
};

export default Header;