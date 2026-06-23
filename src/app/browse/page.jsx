"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { allProfiles } from "../data/profiles";
import { useModal } from "../components/context/ModalContext";
import CTABanner from "../components/CTABanner/CTABanner";
import Footer from "../components/Footer/Footer";
import "./_browsePage.scss";

const cities = [
  "All",
  "Karachi",
  "Lahore",
  "Islamabad",
  "Multan",
  "Faisalabad",
];
const maritalStatuses = ["All", "Single", "Divorced", "Widowed"];

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, openLogin } = useModal();

  const [searchText, setSearchText] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "All",
  );
  const [ageMin, setAgeMin] = useState(
    Number(searchParams.get("ageMin")) || 18,
  );
  const [ageMax, setAgeMax] = useState(
    Number(searchParams.get("ageMax")) || 60,
  );

  if (!user) {
    return (
      <div className="browse-page">
        <div className="browse-locked">
          <h2 className="browse-locked__title">Login to Browse Profiles</h2>
          <p className="browse-locked__text">
            Create a free account or login to start browsing profiles and
            finding your perfect match.
          </p>
          <button className="browse-locked__btn" onClick={openLogin}>
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  const filtered = allProfiles.filter((p) => {
    const cityMatch = cityFilter === "All" || p.city === cityFilter;
    const statusMatch =
      statusFilter === "All" || p.maritalStatus === statusFilter;
    const ageMatch = p.age >= ageMin && p.age <= ageMax;
    const searchMatch =
      searchText === "" ||
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.city.toLowerCase().includes(searchText.toLowerCase()) ||
      p.profession.toLowerCase().includes(searchText.toLowerCase());
    return cityMatch && statusMatch && ageMatch && searchMatch;
  });

  return (
    <div className="browse-page">
      <div className="browse-page__inner">
        <aside className="browse-page__sidebar">
          <h3 className="browse-page__sidebar-title">Filter Profiles</h3>

          <div className="browse-page__filter-group">
            <label className="browse-page__filter-label">Search</label>
            <input
              className="browse-page__search-input"
              type="text"
              placeholder="Name, city, profession..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="browse-page__filter-group">
            <label className="browse-page__filter-label">City</label>
            <select
              className="browse-page__filter-select"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="browse-page__filter-group">
            <label className="browse-page__filter-label">Marital Status</label>
            <select
              className="browse-page__filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {maritalStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="browse-page__filter-group">
            <label className="browse-page__filter-label">
              Age: {ageMin} – {ageMax}
            </label>
            <div className="browse-page__age-row">
              <input
                type="number"
                min={18}
                max={ageMax}
                value={ageMin}
                onChange={(e) => setAgeMin(Number(e.target.value))}
                className="browse-page__age-input"
                placeholder="Min"
              />
              <span>to</span>
              <input
                type="number"
                min={ageMin}
                max={80}
                value={ageMax}
                onChange={(e) => setAgeMax(Number(e.target.value))}
                className="browse-page__age-input"
                placeholder="Max"
              />
            </div>
          </div>
        </aside>

        <main className="browse-page__results">
          <p className="browse-page__count">{filtered.length} profiles found</p>

          <div className="browse-page__grid">
            {filtered.length > 0 ? (
              filtered.map((p, index) => (
                <div
                  key={p.id}
                  className="browse-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="browse-card__image">
                    <img src={p.image} alt={p.name} loading="lazy" />
                  </div>
                  <div className="browse-card__body">
                    <h3 className="browse-card__name">{p.name}</h3>
                    <p className="browse-card__meta">
                      {p.age} yrs • {p.city}
                    </p>
                    <p className="browse-card__profession">{p.profession}</p>
                  </div>
                  <button
                    className="browse-card__btn"
                    onClick={() => router.push(`/profile/${p.id}`)}
                  >
                    View Profile
                  </button>
                </div>
              ))
            ) : (
              <p className="browse-page__empty">
                No profiles match your filters.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <>
      <Suspense
        fallback={
          <div style={{ padding: "100px 24px", minHeight: "100vh" }}>
            Loading...
          </div>
        }
      >
        <BrowseContent />
      </Suspense>
      <CTABanner />
      <Footer />
    </>
  );
}
