import React, { useEffect, useRef } from "react";

const DEFAULT_SIZE_PX = 44;
const DEFAULT_EASE = 0.18; // 0..1 (higher = less lag)

function canShowCursorFollower() {
  if (typeof window === "undefined") return false;
  if (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0) return false;
  if (window.matchMedia?.("(pointer: coarse)").matches) return false;
  return true;
}

const LogoCursor = ({
  src = "/assets/images/Logo-transparent-flipped.png",
  size = DEFAULT_SIZE_PX,
  ease = DEFAULT_EASE,
  zIndex = 2147483647,
}) => {
  const elRef = useRef(null);
  const rafRef = useRef(null);

  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const startedRef = useRef(false);

  useEffect(() => {
    if (!canShowCursorFollower()) return;
    const el = elRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const clampedEase = Math.max(0.01, Math.min(1, Number(ease) || DEFAULT_EASE));

    const onMove = (e) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;

      if (!startedRef.current) {
        startedRef.current = true;
        currentRef.current.x = e.clientX;
        currentRef.current.y = e.clientY;
        el.style.opacity = "1";
      }
    };

    const tick = () => {
      const t = targetRef.current;
      const c = currentRef.current;

      if (reduceMotion) {
        c.x = t.x;
        c.y = t.y;
      } else {
        c.x += (t.x - c.x) * clampedEase;
        c.y += (t.y - c.y) * clampedEase;
      }

      // Center the logo on the cursor.
      el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) translate3d(-50%, -50%, 0)`;
      rafRef.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [ease]);

  if (!canShowCursorFollower()) return null;

  return (
    <img
      ref={elRef}
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: `${Number(size) || DEFAULT_SIZE_PX}px`,
        height: "auto",
        pointerEvents: "none",
        userSelect: "none",
        opacity: 0,
        zIndex,
        willChange: "transform",
      }}
    />
  );
};

export default LogoCursor;
