"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useModal } from "../components/context/ModalContext";
import "./_members.scss";

export default function MembersPage() {
  const router = useRouter();
  const { user, openLogin } = useModal();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id);

      if (!error) setProfiles(data || []);
      setLoading(false);
    };

    fetchProfiles();
  }, [user]);

  if (!user) {
    return (
      <div className="members-page">
        <div className="members-locked">
          <h2 className="members-locked__title">Login to View Members</h2>
          <p className="members-locked__text">
            Login to see real registered members and send interest requests.
          </p>
          <button className="members-locked__btn" onClick={openLogin}>
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="members-page">
      <div className="members-page__inner">
        <h1 className="members-page__title">Real Members (Testing Page)</h1>
        <p className="members-page__subtitle">
          {loading
            ? "Loading members..."
            : `${profiles.length} member${profiles.length === 1 ? "" : "s"} found`}
        </p>

        <div className="members-page__grid">
          {!loading && profiles.length === 0 && (
            <p className="members-page__empty">
              No other members have registered yet.
            </p>
          )}

          {profiles.map((p) => (
            <div key={p.id} className="member-card">
              <div className="member-card__image">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.full_name}
                    className={
                      p.blur_photo ? "member-card__image--blurred" : ""
                    }
                  />
                ) : (
                  <div className="member-card__placeholder">No Photo</div>
                )}
              </div>
              <div className="member-card__body">
                <h3 className="member-card__name">{p.full_name}</h3>
                <p className="member-card__meta">
                  {p.age} yrs • {p.city}
                </p>
                <p className="member-card__profession">{p.profession}</p>
              </div>
              <button
                className="member-card__btn"
                onClick={() => router.push(`/members/${p.id}`)}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
