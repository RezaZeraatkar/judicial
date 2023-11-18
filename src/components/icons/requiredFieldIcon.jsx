import React from "react";

export default function RequiredFieldIcon({ label }) {
  return (
    <div>
      {label}
      <span style={{ color: "red" }}>*</span>
    </div>
  );
}
