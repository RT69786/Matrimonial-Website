"use client";

import React from "react";
import "./_iconbox.scss";

const IconBox = ({ iconClass }) => {
  return (
    <div className="icon-box">
      <i className={iconClass}></i>
    </div>
  );
};

export default IconBox;