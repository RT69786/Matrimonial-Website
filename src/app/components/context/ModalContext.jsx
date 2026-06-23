"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LoginModal } from "../LoginModal/LoginModal";
import { RegisterModal } from "../RegisterModal/RegisterModal";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [user,        setUser]        = useState(null);

  useEffect(() => {
    // check if user is already logged in when page loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // listen for login and logout changes automatically
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeModal]);

  const openLogin    = () => setActiveModal("login");
  const openRegister = () => setActiveModal("register");
  const closeModal   = () => setActiveModal(null);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <ModalContext.Provider value={{ openLogin, openRegister, closeModal, user, logout }}>
      {children}
      {activeModal === "login" && (
        <LoginModal onClose={closeModal} onSwitchToRegister={openRegister} />
      )}
      {activeModal === "register" && (
        <RegisterModal onClose={closeModal} onSwitchToLogin={openLogin} />
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);