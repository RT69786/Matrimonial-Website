"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/app/components/context/ModalContext";
import { supabase } from "@/lib/supabase";
import Footer from "@/app/components/Footer/Footer";
import "./_profileDetail.scss";

export default function ProfileDetailPage() {
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
      console.error(error);
      return;
    }

    setInterestStatus("pending");
  };

  if (pageLoading) {
    return (
      <div className="profile-detail profile-detail--not-found">
        <p>Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-detail profile-detail--not-found">
        <p>Profile not found.</p>
        <button onClick={() => router.push("/browse")}>← Back to Browse</button>
      </div>
    );
  }

  const isOwnProfile = user && user.id === profile.id;
  const isAccepted = interestStatus === "accepted";

  const details = [
    { label: "Age", value: profile.age ? `${profile.age} years` : "N/A" },
    { label: "Height", value: profile.height || "N/A" },
    { label: "City", value: profile.city || "N/A" },
    { label: "Country", value: profile.country || "N/A" },
    { label: "Marital Status", value: profile.marital_status || "N/A" },
    { label: "Profession", value: profile.profession || "N/A" },
    { label: "Education", value: profile.education || "N/A" },
    { label: "Religion", value: profile.religion || "N/A" },
    { label: "Sect", value: profile.sect || "N/A" },
    { label: "Caste", value: profile.caste || "N/A" },
    { label: "Mother Tongue", value: profile.mother_tongue || "N/A" },
  ];

  return (
    <>
      <div className="profile-detail">
        <div className="profile-detail__inner">
          <button
            className="profile-detail__back"
            onClick={() => router.back()}
          >
            ← Back to Browse
          </button>

          <div className="profile-detail__grid">
            <div className="profile-detail__photo-col">
              <div
                className={`profile-detail__photo ${!isAccepted && !isOwnProfile && profile.blur_photo ? "profile-detail__photo--blurred" : ""}`}
              >
                {profile.image_url ? (
                  <img src={profile.image_url} alt={profile.full_name} />
                ) : (
                  <div className="profile-detail__no-photo">No Photo</div>
                )}
              </div>

              {!isOwnProfile && (
                <>
                  {!interestStatus && (
                    <button
                      className="profile-detail__interest-btn"
                      onClick={handleSendInterest}
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Interest"}
                    </button>
                  )}

                  {interestStatus === "pending" && (
                    <div className="profile-detail__status profile-detail__status--pending">
                      ⏳ Interest Sent — Waiting for acceptance
                    </div>
                  )}

                  {interestStatus === "accepted" && (
                    <>
                      <div className="profile-detail__status profile-detail__status--accepted">
                        ✅ Interest Accepted
                      </div>
                      <button
                        className="profile-detail__message-btn"
                        onClick={() => router.push(`/messages/${profile.id}`)}
                      >
                        💬 Send Message
                      </button>
                    </>
                  )}

                  {interestStatus === "declined" && (
                    <div className="profile-detail__status profile-detail__status--declined">
                      ❌ Interest Declined
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="profile-detail__info-col">
              <h1 className="profile-detail__name">{profile.full_name}</h1>
              <p className="profile-detail__tagline">
                {profile.profession} • {profile.city}
              </p>

              {!isAccepted && !isOwnProfile ? (
                <div className="profile-detail__locked">
                  <div className="profile-detail__locked-icon">🔒</div>
                  <h3 className="profile-detail__locked-title">
                    Profile Details are Private
                  </h3>
                  <p className="profile-detail__locked-text">
                    {!interestStatus
                      ? "Send an interest request to view this person's full profile details."
                      : interestStatus === "pending"
                        ? "Your interest request is pending. Once accepted you will be able to see the full profile."
                        : "This profile has declined your interest request."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="profile-detail__about">
                    <h3 className="profile-detail__section-title">About</h3>
                    <p className="profile-detail__about-text">
                      {profile.about || "No description added yet."}
                    </p>
                  </div>

                  <div className="profile-detail__details">
                    <h3 className="profile-detail__section-title">
                      Profile Details
                    </h3>
                    <div className="profile-detail__table">
                      {details.map((d) => (
                        <div key={d.label} className="profile-detail__row">
                          <span className="profile-detail__row-label">
                            {d.label}
                          </span>
                          <span className="profile-detail__row-value">
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
      <Footer />
    </>
  );
}
