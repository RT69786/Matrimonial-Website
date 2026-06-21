"use client";

import React from 'react';
import { ShieldCheck, Lock, HeartHandshake } from 'lucide-react';
import { WhyChooseCard } from '../WhyChooseCard/WhyChooseCard';
import "./_whyChooseUs.scss";

const reasons = [
  {
    id: 1,
    icon: ShieldCheck,
    title: "Verified Profiles",
    description: "Every profile goes through a manual check before it goes live, so you're not wasting time on fake or inactive accounts.",
  },
  {
    id: 2,
    icon: Lock,
    title: "Privacy You Can Trust",
    description: "Your photos and contact details stay hidden until you choose to share them, because we know family reputation matters.",
  },
  {
    id: 3,
    icon: HeartHandshake,
    title: "Matches That Respect Your Values",
    description: "Search and filter by caste, sect, and mother tongue, so every match already fits what your family is looking for.",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="why-choose-us">
      <section className="for-center-why-choose-us">
        <h2 className="why-choose-us__heading">Why Choose Us</h2>

        <div className="why-choose-us__grid">
          {reasons.map((r) => (
            <WhyChooseCard
              key={r.id}
              icon={r.icon}
              title={r.title}
              description={r.description}
            />
          ))}
        </div>
      </section>
    </section>
  );
};