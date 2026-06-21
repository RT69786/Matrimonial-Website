"use client";

import React from "react";
import { AnimatedTestimonials } from "../AnimatedTestimonials/AnimatedTestimonials";
import "./_testimonials.scss";

const testimonialsData = [
  {
    src: "/pics/pic8.jpg",
    name: "Ahmed & Sara",
    designation: "Karachi · Married 2025",
    quote:
      "We messaged for two months before our families ever met. By the time they sat down for tea, we already knew this was right, the rest was just formalities.",
  },
  {
    src: "/pics/pic9.jpg",
    name: "Bilal & Ayesha",
    designation: "Karachi · Married 2024",
    quote:
      "My mother created my profile, honestly. She said she'd know the right one when she saw it, and three weeks later she was right.",
  },
  {
    src: "/pics/pic10.jpg",
    name: "Usman & Mahnoor",
    designation: "Karachi · Married 2025",
    quote:
      "I was hesitant about doing this online at first, but being able to filter by sect and mother tongue meant every profile I opened already made sense for our family.",
  },
  {
    src: "/pics/pic11.jpg",
    name: "Faisal & Hira",
    designation: "Karachi · Married 2024",
    quote:
      "Our first proper conversation was about her work, not the usual rishta questions. That's when I knew this was different from every introduction before it.",
  },
  {
    src: "/pics/pic12.jpg",
    name: "Imran & Zoya",
    designation: "Karachi · Married 2025",
    quote:
      "Her father called mine directly after reading the profile. Within a month both families had met, and within four we were engaged.",
  },
];

export const Testimonials = () => {
  return (
    <section className="testimonials" id="testimonials">
      <section className="for-center-testimonials">
        <h2 className="testimonials__heading">Real Couples, Real Stories</h2>
        <AnimatedTestimonials testimonials={testimonialsData} autoplay={true} />
      </section>
    </section>
  );
};
