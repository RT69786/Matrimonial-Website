"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useModal } from "../components/context/ModalContext";
import "./_messagesList.scss";

export default function MessagesListPage() {
  const router = useRouter();
  const { user } = useModal();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchConversations();
  }, [user]);

  const fetchConversations = async () => {
    // get all accepted interests involving this user in either direction
    const { data: sent } = await supabase
      .from("interests")
      .select("receiver_id")
      .eq("sender_id", user.id)
      .eq("status", "accepted");

    const { data: received } = await supabase
      .from("interests")
      .select("sender_id")
      .eq("receiver_id", user.id)
      .eq("status", "accepted");

    const ids = [
      ...(sent || []).map((i) => i.receiver_id),
      ...(received || []).map((i) => i.sender_id),
    ];

    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("id", ids);

    setConversations(profiles || []);
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="messages-list messages-list--centered">
        <p>Please login to view your messages.</p>
      </div>
    );
  }

  return (
    <div className="messages-list">
      <div className="messages-list__inner">
        <h1 className="messages-list__title">Messages</h1>

        {loading ? (
          <p className="messages-list__empty">Loading...</p>
        ) : conversations.length === 0 ? (
          <div className="messages-list__empty-state">
            <p className="messages-list__empty">No conversations yet.</p>
            <p className="messages-list__empty-sub">
              Once someone accepts your interest request, you can start
              messaging them.
            </p>
            <button
              className="messages-list__browse-btn"
              onClick={() => router.push("/browse")}
            >
              Browse Profiles
            </button>
          </div>
        ) : (
          <div className="messages-list__list">
            {conversations.map((p) => (
              <div
                key={p.id}
                className="conversation-card"
                onClick={() => router.push(`/messages/${p.id}`)}
              >
                <div className="conversation-card__photo">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.full_name} />
                  ) : (
                    <div className="conversation-card__initials">
                      {p.full_name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="conversation-card__info">
                  <h3 className="conversation-card__name">{p.full_name}</h3>
                  <p className="conversation-card__meta">
                    {p.city} • {p.profession}
                  </p>
                </div>
                <span className="conversation-card__arrow">→</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
