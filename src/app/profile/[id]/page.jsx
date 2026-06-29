"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/app/components/context/ModalContext";
import { allProfiles } from "@/app/data/profiles";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Footer from "@/app/components/Footer/Footer";
import "./_profileDetail.scss";

export default function ProfileDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, openLogin } = useModal();

  const [interestStatus, setInterestStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const profile = allProfiles.find((p) => p.id === Number(id));

  useEffect(() => {
    const checkInterest = async () => {
      if (!user || !profile) {
        setCheckingStatus(false);
        return;
      }

      const { data } = await supabase
        .from("interests")
        .select("status")
        .eq("sender_id", user.id)
        .eq("receiver_id", profile.id)
        .single();

      if (data) {
        setInterestStatus(data.status);
      }
      setCheckingStatus(false);
    };

    checkInterest();
  }, [user, profile]);

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

  if (!profile) {
    return (
      <div className="profile-detail profile-detail--not-found">
        <p>Profile not found.</p>
        <button onClick={() => router.push("/browse")}>← Back to Browse</button>
      </div>
    );
  }

  const isAccepted = interestStatus === "accepted";

  const details = [
    { label: "Age", value: `${profile.age} years` },
    { label: "Height", value: profile.height },
    { label: "City", value: profile.city },
    { label: "Country", value: profile.country },
    { label: "Marital Status", value: profile.maritalStatus },
    { label: "Profession", value: profile.profession },
    { label: "Education", value: profile.education },
    { label: "Religion", value: profile.religion },
    { label: "Sect", value: profile.sect },
    { label: "Caste", value: profile.caste },
    { label: "Mother Tongue", value: profile.motherTongue },
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
            {/* ── Photo Column ── */}
            <div className="profile-detail__photo-col">
              <div
                className={`profile-detail__photo ${!isAccepted ? "profile-detail__photo--blurred" : ""}`}
              >
                <Image
                  src={profile.image}
                  alt={profile.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                />
              </div>

              {/* interest button states */}
              {checkingStatus ? null : (
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
                    <div className="profile-detail__status profile-detail__status--accepted">
                      ✅ Interest Accepted
                    </div>
                  )}

                  {interestStatus === "declined" && (
                    <div className="profile-detail__status profile-detail__status--declined">
                      ❌ Interest Declined
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Info Column ── */}
            <div className="profile-detail__info-col">
              <h1 className="profile-detail__name">{profile.name}</h1>
              <p className="profile-detail__tagline">
                {profile.profession} • {profile.city}
              </p>

              {/* if not accepted show locked message */}
              {!isAccepted ? (
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
                      {profile.about}
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
