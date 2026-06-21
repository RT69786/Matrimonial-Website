"use client";

import React from "react";
import "./_stepItem.scss";

export const StepItem = ({ number, title, description, isLast }) => {
  return (
    <div className={`step-item ${isLast ? "step-item--last" : ""}`}>
      <div className="step-item__number">{number}</div>
      <h3 className="step-item__title">{title}</h3>
      <p className="step-item__description">{description}</p>
    </div>
  );
};
