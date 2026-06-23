"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import "./_animatedTestimonials.scss";

export const AnimatedTestimonials = ({ testimonials, autoplay = false }) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index) => index === active;

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const tilts = [-4, 2, -2, 3, -1, 4, -3, 1];
  const randomTilt = (index) => tilts[index % tilts.length];

  return (
    <div className="animated-testimonials">
      <div className="animated-testimonials__grid">
        <div className="animated-testimonials__image-wrap">
          <AnimatePresence>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.src}
                initial={{ opacity: 0, scale: 0.9, rotate: randomTilt(index) }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.7,
                  scale: isActive(index) ? 1 : 0.95,
                  rotate: isActive(index) ? 0 : randomTilt(index),
                  zIndex: isActive(index)
                    ? 40
                    : testimonials.length + 2 - index,
                }}
                exit={{ opacity: 0, scale: 0.9, rotate: randomTilt(index) }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="animated-testimonials__image-item"
              >
                <img
                  src={testimonial.src}
                  alt={testimonial.name}
                  draggable={false}
                  className="animated-testimonials__image"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="animated-testimonials__content">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="animated-testimonials__name">
              {testimonials[active].name}
            </h3>
            <p className="animated-testimonials__designation">
              {testimonials[active].designation}
            </p>
            <motion.p className="animated-testimonials__quote">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ filter: "blur(8px)", opacity: 0, y: 4 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="animated-testimonials__word"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          <div className="animated-testimonials__nav">
            <button
              onClick={handlePrev}
              className="animated-testimonials__nav-btn"
              aria-label="Previous testimonial"
            >
              <IconArrowLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="animated-testimonials__nav-btn"
              aria-label="Next testimonial"
            >
              <IconArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};