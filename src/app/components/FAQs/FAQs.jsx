"use client";

import React from "react";
import "./_faqs.scss";
import FAQItem from "../FAQItem/FAQItem";

const FAQs = () => {
  return (
    <div className="faqs">
      <section className="for-center-faqs">
        <div className="div-one">
          <h2>Frequently asked questions</h2>
        </div>

        <FAQItem question="Is registration free?">
          <p>
            Yes, creating a profile on Rishta.pk is completely free. You can
            register, create your profile, and browse profiles without any
            registration fee.
          </p>
        </FAQItem>

        <FAQItem question="How do I create my profile?">
          <p>
            Simply click on the Register button, fill in your basic information,
            add your profile details, and submit your profile for review.
          </p>
        </FAQItem>

        <FAQItem question="Can I browse profiles before registering?">
          <p>
            Yes, visitors can browse available profiles. However, creating an
            account may be required to access additional profile information and
            features.
          </p>
        </FAQItem>

        <FAQItem question="Are profiles verified?">
          <p>
            We encourage authentic and genuine profiles. Profiles may be
            reviewed to help maintain a trustworthy environment for all members.
          </p>
        </FAQItem>

        <FAQItem question="How can I find suitable matches?">
          <p>
            You can browse profiles, use search filters, and explore members
            based on preferences such as age, location, education, and other
            profile details.
          </p>
        </FAQItem>

        <FAQItem question="Is my personal information secure?">
          <p>
            We value your privacy and take reasonable measures to protect your
            personal information. Users should also avoid sharing sensitive
            information publicly.
          </p>
        </FAQItem>
      </section>
    </div>
  );
};

export default FAQs;
