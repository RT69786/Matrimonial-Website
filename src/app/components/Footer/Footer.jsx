"use client";

import React from "react";
import "./_footer.scss";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Profiles", href: "/browse" },
  { label: "Success Stories", href: "/success-stories" },
  // { label: "Membership",      href: "/membership" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Footer = () => {
  return (
    <div className="footer">
      <section className="for-center-footer">
        <div className="part-one">
          {/* ── Logo ── */}
          <Link href="/" className="navbar__logo">
            <span className="navbar__logo-icon">
              <i className="ri-heart-fill"></i>
            </span>
            <span className="navbar__logo-text">
              Rishta<span className="navbar__logo-dot">.pk</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.href} className="navbar__links-item">
                <Link href={link.href} className="navbar__links-anchor">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="simple-line"></div>

        <div className="part-two">
          <h4>© 2026 Rishta.pk. All rights reserved.</h4>

          <div className="icons-list">
           <i className="ri-facebook-fill"></i>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
