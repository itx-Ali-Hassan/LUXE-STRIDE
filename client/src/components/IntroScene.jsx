import React, { useEffect, useState } from "react";
import "./IntroScene.scss";

// Signature entrance: a faceted brass form rotates in 3D space inside a
// spotlight while the wordmark kinetically assembles letter by letter.
// This is the "hero as thesis" moment — the one bold gesture of the site.
const WORD = "LUXESTRIDE";

export default function IntroScene({ onEnter }) {
  const [phase, setPhase] = useState("build"); // build -> hold -> exit
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 2200);
    return () => clearTimeout(t1);
  }, []);

  const handleEnter = () => {
    setPhase("exit");
    setTimeout(() => {
      setDismissed(true);
      onEnter?.();
    }, 900);
  };

  if (dismissed) return null;

  return (
    <div className={`intro-scene phase-${phase}`} aria-hidden={phase === "exit"}>
      <div className="intro-scene__vignette" />
      <div className="intro-scene__grid" />

      <div className="intro-scene__stage">
        <div className="facet-form">
          <div className="facet facet--top" />
          <div className="facet facet--front" />
          <div className="facet facet--right" />
          <div className="facet facet--back" />
          <div className="facet facet--left" />
          <div className="facet facet--bottom" />
        </div>
        <div className="stage-ring" />
        <div className="stage-glow" />
      </div>

      <div className="intro-scene__mark">
        {WORD.split("").map((ch, i) => (
          <span key={i} style={{ transitionDelay: `${i * 60}ms` }}>
            {ch}
          </span>
        ))}
      </div>
      <p className="intro-scene__tagline reveal-line">Crafted for every step.</p>

      <button
        type="button"
        className={`intro-scene__enter ${phase === "hold" ? "is-ready" : ""}`}
        onClick={handleEnter}
      >
        <span>Enter the House</span>
        <i />
      </button>

      <button type="button" className="intro-scene__skip" onClick={handleEnter}>
        Skip
      </button>
    </div>
  );
}
