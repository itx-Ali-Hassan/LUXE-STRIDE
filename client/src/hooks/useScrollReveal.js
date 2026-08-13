import { useEffect, useRef } from "react";

// Adds an IntersectionObserver-driven ".is-visible" class to any element
// carrying the ".reveal" class, staggered by data-delay (ms).
export default function useScrollReveal(deps = []) {
  const scopeRef = useRef(null);

  useEffect(() => {
    const scope = scopeRef.current || document;
    const els = scope.querySelectorAll(".reveal:not(.is-visible)");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add("is-visible"), Number(delay));
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}
