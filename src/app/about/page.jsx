"use client";

import React from "react";
import "./_about.scss";
import { WhyChooseUs } from "../components/WhyChooseUs/WhyChooseUs";
import CTABanner from "../components/CTABanner/CTABanner";
import Footer from "../components/Footer/Footer";

const page = () => {
  return (
    <>
      <div className="about-page">
        <section className="for-center-about-page">
          <h2>About Rishta.pk</h2>

          <p>
            Rishta.pk is a trusted matrimonial platform helping people find
            meaningful life partners through secure and genuine profiles.
          </p>
        </section>
      </div>
      <WhyChooseUs />
      <CTABanner />
      <Footer />
    </>
  );
};

export default page;
