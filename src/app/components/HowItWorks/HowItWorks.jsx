"use client";

import React from "react";
import { StepItem } from "../StepItem/StepItem";
import "./_howItWorks.scss";

const steps = [
  {
    id: 1,
    title: "Create Your Profile",
    description:
      "Sign up for free and complete your profile with your personal and family details.",
  },
  {
    id: 2,
    title: "Browse & Explore Profiles",
    description:
      "Search and explore profiles based on your preferences and requirements.",
  },
  {
    id: 3,
    title: "Connect & Begin Your Journey",
    description:
      "Express interest and take the first step toward finding your life partner.",
  },
  //   {
  //     id: 4,
  //     title: "Families Connect",
  //     description:
  //       "Once both sides are interested, families take it forward, exactly how it should be.",
  //   },
];

export const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <section className="for-center-how-it-works">
        <h2 className="how-it-works__heading">How It Works</h2>
        <p className="how-it-works__subheading">
          Four simple steps from creating a profile to finding the right match.
        </p>

        <div className="how-it-works__steps">
          {steps.map((step, index) => (
            <StepItem
              key={step.id}
              number={step.id}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </section>
    </section>
  );
};
