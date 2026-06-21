"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "../../context/ModalContext";
import { allProfiles } from "../../data/profiles";
import Footer from "../../components/Footer/Footer";
import "./_profileDetail.scss";

export default function ProfileDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { openRegister } = useModal();

  const profile = allProfiles.find((p) => p.id === Number(id));

  if (!profile) {
    return (
      <div className="profile-detail profile-detail--not-found">
        <p>Profile not found.</p>
        <button onClick={() => router.push("/browse")}>← Back to Browse</button>
      </div>
    );
  }

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
            <div className="profile-detail__photo-col">
              <div className="profile-detail__photo">
                <img src={profile.image} alt={profile.name} />
              </div>
              <button
                className="profile-detail__interest-btn"
                onClick={openRegister}
              >
                Send Interest
              </button>
            </div>

            <div className="profile-detail__info-col">
              <h1 className="profile-detail__name">{profile.name}</h1>
              <p className="profile-detail__tagline">
                {profile.profession} • {profile.city}
              </p>

              <div className="profile-detail__about">
                <h3 className="profile-detail__section-title">About</h3>
                <p className="profile-detail__about-text">{profile.about}</p>
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
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
