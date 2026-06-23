"use client";

import React from "react";
import Image from "next/image";
import "./_profilecard.scss";

export const ProfileCard = ({
  image,
  name,
  age,
  city,
  profession,
  onViewProfile,
}) => {
  return (
    <div className="profile-card">
      <div className="profile-card__image">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
      </div>

      <div className="profile-card__body">
        <h3 className="profile-card__name">{name}</h3>
        <p className="profile-card__meta">
          {age} yrs &bull; {city}
        </p>
        <p className="profile-card__profession">{profession}</p>
      </div>

      <button className="profile-card__btn" onClick={onViewProfile}>
        View Profile
      </button>
    </div>
  );
};
