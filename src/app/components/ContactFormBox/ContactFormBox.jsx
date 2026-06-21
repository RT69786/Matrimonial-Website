"use client";

import React from "react";
import "./_contactformbox.scss";

export default function ContactFormBox() {
  return (
    <div className="form-box">
      <form className="inner-form">
        <input type="text" placeholder="Name" />

        <div className="row">
          <input type="email" placeholder="Email" />
          <input type="text" placeholder="Phone" />
        </div>

        <textarea placeholder="Message"></textarea>

        <button type="submit">SEND</button>
      </form>
    </div>
  );
}
