"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useModal } from "../components/context/ModalContext";
import "./_myInterests.scss";

export default function MyInterestsPage() {
  const { user, openLogin, refreshPendingCount } = useModal();

  const [activeTab, setActiveTab] = useState("received");
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchInterests();
  }, [user]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const attachProfiles = async (list, idField) => {
    const ids = list.map((i) => i[idField]);
    if (ids.length === 0) return [];

    const { data: profilesData } = await supabase
      .from("profiles")
      .select("*")
      .in("id", ids);

    return list.map((interest) => ({
      ...interest,
      profile: profilesData?.find((p) => p.id === interest[idField]) || null,
    }));
  };

  const fetchInterests = async () => {
    setLoading(true);

    const { data: receivedData } = await supabase
      .from("interests")
      .select("*")
      .eq("receiver_id", user.id);

    const { data: sentData } = await supabase
      .from("interests")
      .select("*")
      .eq("sender_id", user.id);

    setReceived(await attachProfiles(receivedData || [], "sender_id"));
    setSent(await attachProfiles(sentData || [], "receiver_id"));
    setLoading(false);
  };

  const handleRespond = async (interestId, status) => {
    const { error } = await supabase
      .from("interests")
      .update({ status })
      .eq("id", interestId);

    if (!error) {
      fetchInterests();
      refreshPendingCount();
      setToast(
        status === "accepted" ? "Interest accepted!" : "Interest declined.",
      );
    }
  };

  const handleWithdraw = async (interestId) => {
    // remove from UI immediately so it feels instant
    setSent((prev) => prev.filter((i) => i.id !== interestId));

    const { error } = await supabase
      .from("interests")
      .delete()
      .eq("id", interestId);

    if (error) {
      setToast("Could not withdraw. Try again.");
      fetchInterests(); // restore correct state if delete failed
    } else {
      setToast("Interest request withdrawn.");
    }
  };

  if (!user) {
    return (
      <div className="my-interests">
        <div className="my-interests__locked">
          <h2>Login to View Your Interests</h2>
          <button onClick={openLogin}>Login to Continue</button>
        </div>
      </div>
    );
  }

  const list = activeTab === "received" ? received : sent;

  const receivedPendingCount = received.filter(
    (i) => i.status === "pending",
  ).length;
  const sentPendingCount = sent.filter((i) => i.status === "pending").length;

  return (
    <div className="my-interests">
      {toast && <div className="my-interests__toast">{toast}</div>}

      <div className="my-interests__inner">
        <h1 className="my-interests__title">My Interests</h1>

        <div className="my-interests__tabs">
          <button
            className={`my-interests__tab ${activeTab === "received" ? "my-interests__tab--active" : ""}`}
            onClick={() => setActiveTab("received")}
          >
            Received {receivedPendingCount > 0 && `(${receivedPendingCount})`}
          </button>
          <button
            className={`my-interests__tab ${activeTab === "sent" ? "my-interests__tab--active" : ""}`}
            onClick={() => setActiveTab("sent")}
          >
            Sent {sentPendingCount > 0 && `(${sentPendingCount})`}
          </button>
        </div>

        {loading ? (
          <p className="my-interests__loading">Loading...</p>
        ) : list.length === 0 ? (
          <p className="my-interests__empty">
            {activeTab === "received"
              ? "No interests received yet."
              : "You haven't sent any interests yet."}
          </p>
        ) : (
          <div className="my-interests__list">
            {list.map((interest) => (
              <div key={interest.id} className="interest-card">
                <div className="interest-card__photo">
                  {interest.profile?.image_url ? (
                    <img
                      src={interest.profile.image_url}
                      alt={interest.profile.full_name}
                    />
                  ) : (
                    <div className="interest-card__no-photo">?</div>
                  )}
                </div>
                <div className="interest-card__info">
                  <h3>{interest.profile?.full_name || "Unknown"}</h3>
                  <p>
                    {interest.profile?.age} yrs • {interest.profile?.city}
                  </p>
                </div>

                {activeTab === "received" && interest.status === "pending" && (
                  <div className="interest-card__actions">
                    <button
                      className="interest-card__accept"
                      onClick={() => handleRespond(interest.id, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="interest-card__decline"
                      onClick={() => handleRespond(interest.id, "declined")}
                    >
                      Decline
                    </button>
                  </div>
                )}

                {activeTab === "sent" && interest.status === "pending" && (
                  <div className="interest-card__actions">
                    <button
                      className="interest-card__decline"
                      onClick={() => handleWithdraw(interest.id)}
                    >
                      Withdraw
                    </button>
                  </div>
                )}

                {((activeTab === "received" && interest.status !== "pending") ||
                  (activeTab === "sent" && interest.status !== "pending")) && (
                  <div
                    className={`interest-card__badge interest-card__badge--${interest.status}`}
                  >
                    {interest.status}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
