"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useModal } from "../context/ModalContext";
import "./_navbar.scss";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Profiles", href: "/browse" },
  { label: "Success Stories", href: "/#testimonials" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const {
    openLogin,
    openRegister,
    user,
    authChecked,
    logout,
    pendingCount,
    hasAccount,
    unreadMessages,
  } = useModal();

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

  const totalBadge = pendingCount + unreadMessages;

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

        {/* ── Desktop Auth ── */}
        <div className="navbar__auth">
          {!authChecked ? null : user ? (
            <div className="navbar__user">
              <div className="navbar__user-avatar">
                {user.email.charAt(0).toUpperCase()}
                {totalBadge > 0 && (
                  <span className="navbar__user-badge">{totalBadge}</span>
                )}
              </div>
              <div className="navbar__user-dropdown">
                <p className="navbar__user-dropdown-email">{user.email}</p>
                <Link href="/browse" className="navbar__user-dropdown-link">
                  Browse Profiles
                </Link>
                <Link
                  href="/my-interests"
                  className="navbar__user-dropdown-link"
                >
                  My Interests {pendingCount > 0 && `(${pendingCount})`}
                </Link>
                <Link href="/messages" className="navbar__user-dropdown-link">
                  💬 Messages {unreadMessages > 0 && `(${unreadMessages})`}
                </Link>
                <Link
                  href="/edit-profile"
                  className="navbar__user-dropdown-link"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={logout}
                  className="navbar__user-dropdown-logout"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : hasAccount ? (
            <button onClick={openLogin} className="navbar__auth-login">
              Login
            </button>
          ) : (
            <>
              <button onClick={openLogin} className="navbar__auth-login">
                Login
              </button>
              <button onClick={openRegister} className="navbar__auth-register">
                Register Free
              </button>
            </>
          )}
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

      {/* ── Mobile Drawer ── */}
      <div
        className={`navbar__drawer ${menuOpen ? "navbar__drawer--open" : ""}`}
      >
        <ul className="navbar__drawer-links">
          {navLinks.map((link) => (
            <li key={link.href} className="navbar__drawer-item">
              <Link
                href={link.href}
                className="navbar__drawer-anchor"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {user && (
            <>
              <li className="navbar__drawer-item">
                <Link
                  href="/browse"
                  className="navbar__drawer-anchor"
                  onClick={() => setMenuOpen(false)}
                >
                  Browse Profiles
                </Link>
              </li>
              <li className="navbar__drawer-item">
                <Link
                  href="/my-interests"
                  className="navbar__drawer-anchor"
                  onClick={() => setMenuOpen(false)}
                >
                  My Interests {pendingCount > 0 && `(${pendingCount})`}
                </Link>
              </li>
              <li className="navbar__drawer-item">
                <Link
                  href="/messages"
                  className="navbar__drawer-anchor"
                  onClick={() => setMenuOpen(false)}
                >
                  💬 Messages {unreadMessages > 0 && `(${unreadMessages})`}
                </Link>
              </li>
              <li className="navbar__drawer-item">
                <Link
                  href="/edit-profile"
                  className="navbar__drawer-anchor"
                  onClick={() => setMenuOpen(false)}
                >
                  Edit Profile
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="navbar__drawer-auth">
          {!authChecked ? null : user ? (
            <>
              <div className="navbar__drawer-user">
                <div className="navbar__user-avatar">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <p className="navbar__drawer-user-email">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="navbar__auth-register"
              >
                Logout
              </button>
            </>
          ) : hasAccount ? (
            <button onClick={openLogin} className="navbar__auth-login">
              Login
            </button>
          ) : (
            <>
              <button onClick={openLogin} className="navbar__auth-login">
                Login
              </button>
              <button onClick={openRegister} className="navbar__auth-register">
                Register Free
              </button>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="navbar__overlay" onClick={() => setMenuOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
