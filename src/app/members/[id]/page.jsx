"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useModal } from "../../components/context/ModalContext";
import "./_memberDetail.scss";

export default function MemberDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, openLogin } = useModal();

  const [profile, setProfile] = useState(null);
  const [interestStatus, setInterestStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      setProfile(profileData);

      if (user && profileData) {
        const { data: interestData } = await supabase
          .from("interests")
          .select("status")
          .eq("sender_id", user.id)
          .eq("receiver_id", profileData.id)
          .single();

        if (interestData) setInterestStatus(interestData.status);
      }

      setPageLoading(false);
    };

    fetchData();
  }, [id, user]);

  const handleSendInterest = async () => {
    if (!user) {
      openLogin();
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("interests").insert({
      sender_id: user.id,
      receiver_id: profile.id,
      status: "pending",
    });

    setLoading(false);

    if (error) {
      alert("Could not send interest: " + error.message);
      return;
    }

    setInterestStatus("pending");
  };

  if (pageLoading)
    return <div className="member-detail__loading">Loading...</div>;

  if (!profile) {
    return (
      <div className="member-detail member-detail--not-found">
        <p>Profile not found.</p>
        <button onClick={() => router.push("/members")}>
          ← Back to Members
        </button>
      </div>
    );
  }

  const isAccepted = interestStatus === "accepted";
  const isOwnProfile = user && user.id === profile.id;

  const details = [
    { label: "Age", value: `${profile.age} years` },
    { label: "Height", value: profile.height || "N/A" },
    { label: "City", value: profile.city },
    { label: "Country", value: profile.country },
    { label: "Marital Status", value: profile.marital_status || "N/A" },
    { label: "Profession", value: profile.profession || "N/A" },
    { label: "Education", value: profile.education || "N/A" },
    { label: "Religion", value: profile.religion || "N/A" },
    { label: "Sect", value: profile.sect || "N/A" },
    { label: "Caste", value: profile.caste || "N/A" },
    { label: "Mother Tongue", value: profile.mother_tongue || "N/A" },
  ];

  return (
    <div className="member-detail">
      <div className="member-detail__inner">
        <button className="member-detail__back" onClick={() => router.back()}>
          ← Back to Members
        </button>

        <div className="member-detail__grid">
          <div className="member-detail__photo-col">
            <div
              className={`member-detail__photo ${!isAccepted && profile.blur_photo ? "member-detail__photo--blurred" : ""}`}
            >
              {profile.image_url ? (
                <img src={profile.image_url} alt={profile.full_name} />
              ) : (
                <div className="member-detail__no-photo">No Photo</div>
              )}
            </div>

            {!isOwnProfile && (
              <>
                {!interestStatus && (
                  <button
                    className="member-detail__interest-btn"
                    onClick={handleSendInterest}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Interest"}
                  </button>
                )}
                {interestStatus === "pending" && (
                  <div className="member-detail__status member-detail__status--pending">
                    ⏳ Interest Sent — Waiting for acceptance
                  </div>
                )}
                {interestStatus === "accepted" && (
                  <div className="member-detail__status member-detail__status--accepted">
                    ✅ Interest Accepted
                  </div>
                )}
                {interestStatus === "declined" && (
                  <div className="member-detail__status member-detail__status--declined">
                    ❌ Interest Declined
                  </div>
                )}
              </>
            )}
          </div>

          <div className="member-detail__info-col">
            <h1 className="member-detail__name">{profile.full_name}</h1>
            <p className="member-detail__tagline">
              {profile.profession} • {profile.city}
            </p>

            {!isAccepted && !isOwnProfile ? (
              <div className="member-detail__locked">
                <div className="member-detail__locked-icon">🔒</div>
                <h3 className="member-detail__locked-title">
                  Profile Details are Private
                </h3>
                <p className="member-detail__locked-text">
                  {!interestStatus
                    ? "Send an interest request to view this person's full profile details."
                    : interestStatus === "pending"
                      ? "Your interest request is pending. Once accepted you will be able to see the full profile."
                      : "This profile has declined your interest request."}
                </p>
              </div>
            ) : (
              <>
                <div className="member-detail__about">
                  <h3 className="member-detail__section-title">About</h3>
                  <p className="member-detail__about-text">
                    {profile.about || "No description added yet."}
                  </p>
                </div>

                <div className="member-detail__details">
                  <h3 className="member-detail__section-title">
                    Profile Details
                  </h3>
                  <div className="member-detail__table">
                    {details.map((d) => (
                      <div key={d.label} className="member-detail__row">
                        <span className="member-detail__row-label">
                          {d.label}
                        </span>
                        <span className="member-detail__row-value">
                          {d.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
