"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProfileCard } from "../ProfileCard/ProfileCard";
import "./_featuredProfiles.scss";

const featuredProfiles = [
  {
    id: 1,
    image: "/pics/pic2.jpg",
    name: "Naz Soomro",
    age: 37,
    city: "Karachi",
    profession: "Teacher",
  },
  {
    id: 2,
    image: "/pics/pic3.jpg",
    name: "Sana Khan",
    age: 29,
    city: "Lahore",
    profession: "Doctor",
  },
  {
    id: 3,
    image: "/pics/pic4.jpg",
    name: "Hania Amir",
    age: 29,
    city: "Karachi",
    profession: "Actress",
  },
  {
    id: 4,
    image: "/pics/pic5.jpg",
    name: "Savera Nadeem",
    age: 24,
    city: "Karachi",
    profession: "Student",
  },
  {
    id: 5,
    image: "/pics/pic6.jpg",
    name: "Bisma Rashid",
    age: 26,
    city: "Karachi",
    profession: "Doctor",
  },
  {
    id: 6,
    image: "/pics/pic7.jpg",
    name: "Malaika Nadeem",
    age: 24,
    city: "Karachi",
    profession: "Student",
  },
];

export const FeaturedProfiles = () => {
  const router = useRouter();

  return (
    <section className="featured-profiles">
      <section className="for-center-featured-profiles">
        <h2 className="featured-profiles__heading">Featured Profiles</h2>

        <div className="featured-profiles__grid">
          {featuredProfiles.map((p) => (
            <ProfileCard
              key={p.id}
              image={p.image}
              name={p.name}
              age={p.age}
              city={p.city}
              profession={p.profession}
              onViewProfile={() => router.push(`/profile/${p.id}`)}
            />
          ))}
        </div>
      </section>
    </section>
  );
};
