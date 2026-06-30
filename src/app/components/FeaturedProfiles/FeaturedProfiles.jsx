"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ProfileCard } from "../ProfileCard/ProfileCard";
import "./_featuredProfiles.scss";

export const FeaturedProfiles = () => {
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error) setProfiles(data || []);
      setLoading(false);
    };

    fetchFeatured();
  }, []);

  // don't render the section at all if no real users exist yet
  if (!loading && profiles.length === 0) return null;
  if (loading) return null;

  return (
    <section className="featured-profiles">
      <section className="for-center-featured-profiles">
        <h2 className="featured-profiles__heading">Featured Profiles</h2>

        <div className="featured-profiles__grid">
          {profiles.map((p) => (
            <ProfileCard
              key={p.id}
              image={p.image_url}
              blurred={p.blur_photo}
              name={p.full_name}
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

export default FeaturedProfiles;
