"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { LoginModal } from "../LoginModal/LoginModal";
import { RegisterModal } from "../RegisterModal/RegisterModal";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [activeModal, setActiveModal] = useState(null);

  const openLogin    = () => setActiveModal("login");
  const openRegister = () => setActiveModal("register");
  const closeModal   = () => setActiveModal(null);

  useEffect(() => {
    document.body.style.overflow = activeModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeModal]);

  return (
    <ModalContext.Provider value={{ openLogin, openRegister, closeModal }}>
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