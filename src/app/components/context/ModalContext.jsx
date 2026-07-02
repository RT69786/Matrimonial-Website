"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LoginModal } from "../LoginModal/LoginModal";
import { RegisterModal } from "../RegisterModal/RegisterModal";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [activeModal,    setActiveModal]    = useState(null);
  const [user,           setUser]           = useState(null);
  const [authChecked,    setAuthChecked]    = useState(false);
  const [pendingCount,   setPendingCount]   = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [hasAccount,     setHasAccount]     = useState(false);
  const [ownProfileId,   setOwnProfileId]   = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedHasAccount = localStorage.getItem("rishta_has_account") === "true";
    const storedProfileId  = sessionStorage.getItem("rishta_profile_id");
    setHasAccount(storedHasAccount);
    setOwnProfileId(storedProfileId);
  }, []);

  const fetchPendingCount = async (currentUser) => {
    if (!currentUser) { setPendingCount(0); return; }
    const { count } = await supabase
      .from("interests")
      .select("*", { count: "exact", head: true })
      .eq("receiver_id", currentUser.id)
      .eq("status", "pending");
    setPendingCount(count || 0);
  };

  const fetchUnreadMessages = async (currentUser) => {
    if (!currentUser) { setUnreadMessages(0); return; }
    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("receiver_id", currentUser.id)
      .eq("is_read", false);
    setUnreadMessages(count || 0);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      fetchPendingCount(session?.user ?? null);
      fetchUnreadMessages(session?.user ?? null);
      setAuthChecked(true);

      if (session?.user?.id) {
        sessionStorage.setItem("rishta_profile_id", session.user.id);
        setOwnProfileId(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        fetchPendingCount(session?.user ?? null);
        fetchUnreadMessages(session?.user ?? null);
        setAuthChecked(true);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      fetchPendingCount(user);
      fetchUnreadMessages(user);
    }, 10000);
    return () => clearInterval(interval);
  }, [user]);

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
    setPendingCount(0);
    setUnreadMessages(0);
  };

  const refreshPendingCount   = () => fetchPendingCount(user);
  const refreshUnreadMessages = () => fetchUnreadMessages(user);

  const markHasAccount = () => {
    if (typeof window === "undefined") return;
    localStorage.setItem("rishta_has_account", "true");
    setHasAccount(true);
  };

  const setOwnProfile = (profileId) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("rishta_profile_id", profileId);
    setOwnProfileId(profileId);
  };

  return (
    <ModalContext.Provider value={{
      openLogin, openRegister, closeModal,
      user, authChecked, logout,
      pendingCount, refreshPendingCount,
      unreadMessages, refreshUnreadMessages,
      hasAccount, markHasAccount,
      ownProfileId, setOwnProfile,
    }}>
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