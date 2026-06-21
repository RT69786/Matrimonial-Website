"use client";

import React from "react";
import "./_contact.scss";
import ContactFormBox from "../components/ContactFormBox/ContactFormBox";
import IconBox from "../components/IconBox/IconBox";
import Footer from "../components/Footer/Footer";
import FAQs from "../components/FAQs/FAQs";
import CTABanner from "../components/CTABanner/CTABanner";

const page = () => {
  return (
    <>
      <div className="contact-page">
        <div className="for-center-contact-page">
          <div className="left-side">
            <h2>Get in Touch With Us</h2>

            <p>
              Have questions about creating a profile, finding suitable matches,
              or using our platform? Our team is here to assist you. Reach out
              to us and we'll be happy to help you on your journey toward
              finding a meaningful life partner.
            </p>

            <div className="small-box-parts">
              <div className="part-one">
                <IconBox iconClass="ri-mail-open-line" />
                <h5>Email</h5>
                <h6>support@rishta.pk</h6>
              </div>

              <div className="part-two">
                <IconBox iconClass="ri-phone-line" />
                <h5>Phone</h5>
                <h6>647 952 3105</h6>
              </div>
            </div>
          </div>

          <div className="right-side">
            <ContactFormBox />
          </div>
        </div>
      </div>
      <FAQs/>
      <CTABanner/>
      <Footer />
    </>
  );
};

export default page;
