"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LoginModal } from "../LoginModal/LoginModal";
import { RegisterModal } from "../RegisterModal/RegisterModal";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPendingCount = async (currentUser) => {
    if (!currentUser) {
      setPendingCount(0);
      return;
    }

    const { count } = await supabase
      .from("interests")
      .select("*", { count: "exact", head: true })
      .eq("receiver_id", currentUser.id)
      .eq("status", "pending");

    setPendingCount(count || 0);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      fetchPendingCount(session?.user ?? null);
      setAuthChecked(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      fetchPendingCount(session?.user ?? null);
      setAuthChecked(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => fetchPendingCount(user), 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    document.body.style.overflow = activeModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeModal]);

  const openLogin = () => setActiveModal("login");
  const openRegister = () => setActiveModal("register");
  const closeModal = () => setActiveModal(null);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPendingCount(0);
  };

  const refreshPendingCount = () => fetchPendingCount(user);

  return (
    <ModalContext.Provider
      value={{
        openLogin,
        openRegister,
        closeModal,
        user,
        authChecked,
        logout,
        pendingCount,
        refreshPendingCount,
      }}
    >
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
