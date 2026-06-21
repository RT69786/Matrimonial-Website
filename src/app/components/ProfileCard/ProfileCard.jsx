"use client";

import React from 'react';
import "./_profilecard.scss";

export const ProfileCard = ({ image, name, age, city, profession, onViewProfile }) => {
  return (
    <div className="profile-card">
      <div className="profile-card__image">
        <img src={image} alt={name} />
      </div>

      <div className="profile-card__body">
        <h3 className="profile-card__name">{name}</h3>
        <p className="profile-card__meta">{age} yrs &bull; {city}</p>
        <p className="profile-card__profession">{profession}</p>
      </div>

      <button className="profile-card__btn" onClick={onViewProfile}>
        View Profile
      </button>
    </div>
  );
};