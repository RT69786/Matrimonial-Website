"use client";

import { useState, useRef, useEffect } from "react";
import "./_faqitem.scss";

const FAQItem = ({ question, children }) => {
  const [open, setOpen] = useState(false);
  const answerRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    setHeight(open ? `${answerRef.current.scrollHeight}px` : "0px");
  }, [open]);

  return (
    <div className="faq-item">
      <div className="faq-question" onClick={() => setOpen(!open)}>
        <h4>{question}</h4>
        <span className="arrow">↓</span>
      </div>

      <div
        ref={answerRef}
        className="faq-answer"
        style={{ maxHeight: height }}
      >
        {children}
      </div>
    </div>
  );
};

export default FAQItem;
