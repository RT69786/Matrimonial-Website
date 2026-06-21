"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import "./_quickSearch.scss";

const lookingForOptions = [
  "Any", "Single", "Nikah broke",
  "Divorced no children", "Divorced have children",
  "Widowed no children", "Widowed have children",
  "Separated no children", "Separated have children",
  "Married no children", "Married have children",
];

const ageOptions = Array.from({ length: 50 - 20 + 1 }, (_, i) => 20 + i);

export const QuickSearch = () => {
  const router = useRouter();
  const [lookingFor, setLookingFor] = useState("");
  const [ageFrom,    setAgeFrom]    = useState("");
  const [ageTo,      setAgeTo]      = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (lookingFor) params.set("status",  lookingFor);
    if (ageFrom)    params.set("ageMin",  ageFrom);
    if (ageTo)      params.set("ageMax",  ageTo);
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className='quicksearch'>
      <section className='for-center-quicksearch'>
        <div className='search-bar'>

          <div className='select-wrap'>
            <select required value={lookingFor} onChange={(e) => setLookingFor(e.target.value)}>
              <option value="" disabled hidden>I am looking for</option>
              {lookingForOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className='select-wrap'>
            <select required value={ageFrom} onChange={(e) => setAgeFrom(e.target.value)}>
              <option value="" disabled hidden>Age From</option>
              {ageOptions.map((age) => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>

          <div className='select-wrap'>
            <select required value={ageTo} onChange={(e) => setAgeTo(e.target.value)}>
              <option value="" disabled hidden>Age To</option>
              {ageOptions.map((age) => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>

          <button className='search-btn' onClick={handleSearch}>
            SEARCH PARTNER
          </button>

        </div>
      </section>
    </div>
  );
};