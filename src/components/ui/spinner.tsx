"use client";
import React from "react";

export default function Spinner({
  w=175,
  h=175,
  rotate=true,
}: {
  w: number;
  h: number;
  rotate: boolean;
}) {
  return (
    <div
      className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
      style={{ width: `${w}px`, height: `${h}px`, pointerEvents: "none" }}
      aria-hidden={!rotate ? "true" : "false"}
    >
      <div
        className={`knob ${rotate ? "rotate" : ""}`}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
