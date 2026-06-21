"use client";

import React from 'react';
import "./_whyChooseCard.scss";

export const WhyChooseCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="why-choose-card">
      <div className="why-choose-card__icon">
        <Icon size={32} strokeWidth={1.75} />
      </div>
      <h3 className="why-choose-card__title">{title}</h3>
      <p className="why-choose-card__description">{description}</p>
    </div>
  );
};