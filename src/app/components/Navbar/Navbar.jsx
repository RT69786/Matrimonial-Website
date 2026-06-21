"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useModal } from "../context/ModalContext";
import "./_navbar.scss";

const navLinks = [
  { label: "Home",             href: "/" },
  { label: "Browse Profiles",  href: "/browse" },
  { label: "Success Stories",  href: "/#testimonials" },
  { label: "About",            href: "/about" },
  { label: "Contact",          href: "/contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openLogin, openRegister } = useModal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">

        <Link href="/" className="navbar__logo">
          <span className="navbar__logo-icon">
            <i className="ri-heart-fill"></i>
          </span>
          <span className="navbar__logo-text">
            Rishta<span className="navbar__logo-dot">.pk</span>
          </span>
        </Link>

        <ul className="navbar__links">
          {navLinks.map((link) => (
            <li key={link.href} className="navbar__links-item">
              <Link href={link.href} className="navbar__links-anchor">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar__auth">
          <button onClick={openLogin}    className="navbar__auth-login">Login</button>
          <button onClick={openRegister} className="navbar__auth-register">Register Free</button>
        </div>

        <button
          className={`navbar__hamburger ${menuOpen ? "navbar__hamburger--open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`navbar__drawer ${menuOpen ? "navbar__drawer--open" : ""}`}>
        <ul className="navbar__drawer-links">
          {navLinks.map((link) => (
            <li key={link.href} className="navbar__drawer-item">
              <Link href={link.href} className="navbar__drawer-anchor" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="navbar__drawer-auth">
          <button onClick={openLogin}    className="navbar__auth-login">Login</button>
          <button onClick={openRegister} className="navbar__auth-register">Register Free</button>
        </div>
      </div>

      {menuOpen && <div className="navbar__overlay" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
};

export default Navbar;