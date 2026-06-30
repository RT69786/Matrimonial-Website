"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useModal } from "../context/ModalContext";
import { ProfileCard } from "../ProfileCard/ProfileCard";
import "./_featuredProfiles.scss";

export const FeaturedProfiles = () => {
  const router = useRouter();
  const { user, authChecked } = useModal();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // wait until we know for sure whether someone is logged in or not
    if (!authChecked) return;

    const fetchFeatured = async () => {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (user) {
        query = query.neq("id", user.id);
      }

      const { data, error } = await query;

      if (!error) setProfiles(data || []);
      setLoading(false);
    };

    fetchFeatured();
  }, [user, authChecked]);

  if (loading) return null;
  if (profiles.length === 0) return null;

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
