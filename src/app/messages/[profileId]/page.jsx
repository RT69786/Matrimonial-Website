"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useModal } from "@/app/components/context/ModalContext";
import Footer from "@/app/components/Footer/Footer";
import "./_messages.scss";

export default function MessagesPage() {
  const { profileId } = useParams();
  const router = useRouter();
  const { user } = useModal();

  const [otherProfile, setOtherProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notAllowed, setNotAllowed] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user, profileId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadData = async () => {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profileId)
      .single();

    setOtherProfile(profileData);

    // check direction 1: current user sent interest to profileId and accepted
    const { data: interest1 } = await supabase
      .from("interests")
      .select("id")
      .eq("sender_id", user.id)
      .eq("receiver_id", profileId)
      .eq("status", "accepted")
      .maybeSingle();

    // check direction 2: profileId sent interest to current user and accepted
    const { data: interest2 } = await supabase
      .from("interests")
      .select("id")
      .eq("sender_id", profileId)
      .eq("receiver_id", user.id)
      .eq("status", "accepted")
      .maybeSingle();

    if (!interest1 && !interest2) {
      setNotAllowed(true);
      setLoading(false);
      return;
    }

    const { data: messagesData } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${profileId}),and(sender_id.eq.${profileId},receiver_id.eq.${user.id})`,
      )
      .order("created_at", { ascending: true });

    setMessages(messagesData || []);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setSending(true);

    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: user.id,
        receiver_id: profileId,
        content: newMessage.trim(),
      })
      .select()
      .single();

    setSending(false);

    if (!error && data) {
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) {
    return (
      <div className="messages-page messages-page--centered">
        <p>Please login to view messages.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="messages-page messages-page--centered">
        <p>Loading...</p>
      </div>
    );
  }

  if (notAllowed) {
    return (
      <div className="messages-page messages-page--centered">
        <div className="messages-page__not-allowed">
          <div className="messages-page__not-allowed-icon">🔒</div>
          <h2>You can't message this person yet</h2>
          <p>
            Messaging is only available after both of you have accepted each
            other's interest request.
          </p>
          <button onClick={() => router.back()}>← Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="messages-page">
        <div className="messages-page__inner">
          <div className="messages-page__header">
            <button
              className="messages-page__back"
              onClick={() => router.back()}
            >
              ←
            </button>
            <div className="messages-page__header-photo">
              {otherProfile?.image_url ? (
                <img
                  src={otherProfile.image_url}
                  alt={otherProfile.full_name}
                />
              ) : (
                <div className="messages-page__header-initials">
                  {otherProfile?.full_name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="messages-page__header-info">
              <h2 className="messages-page__header-name">
                {otherProfile?.full_name}
              </h2>
              <p className="messages-page__header-sub">
                {otherProfile?.city} • {otherProfile?.profession}
              </p>
            </div>
          </div>

          <div className="messages-page__chat">
            {messages.length === 0 && (
              <p className="messages-page__empty">
                No messages yet. Say salaam! 👋
              </p>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message-bubble ${msg.sender_id === user.id ? "message-bubble--sent" : "message-bubble--received"}`}
              >
                <p className="message-bubble__text">{msg.content}</p>
                <span className="message-bubble__time">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          <div className="messages-page__input-area">
            <textarea
              className="messages-page__input"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              className="messages-page__send-btn"
              onClick={handleSend}
              disabled={sending || !newMessage.trim()}
            >
              {sending ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
