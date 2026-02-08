import React, { useEffect, useMemo, useRef } from "react";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function parseHexColor(hex) {
  const normalized = hex.replace("#", "").trim();
  if (normalized.length !== 6) return { r: 0, g: 0, b: 0 };
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return { r, g, b };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(c1, c2, t) {
  const r = Math.round(lerp(c1.r, c2.r, t));
  const g = Math.round(lerp(c1.g, c2.g, t));
  const b = Math.round(lerp(c1.b, c2.b, t));
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Canvas-based dot grid background inspired by React Bits "Dot Grid".
 * Mounted as fixed full-viewport background; does not intercept pointer events.
 */
export default function DotGridBackground({
  dotSize = 4,
  gap = 14,
  baseColor = "#f9dcdc",
  activeColor = "#eb0400",
  proximity = 110,
  speedTrigger = 100,
  shockRadius = 250,
  shockStrength = 5,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.5,
  className = "",
  style = {},
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  const colors = useMemo(() => {
    return {
      base: parseHexColor(baseColor),
      active: parseHexColor(activeColor),
    };
  }, [baseColor, activeColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    let grid = [];
    const pointer = {
      x: -1e9,
      y: -1e9,
      lastX: -1e9,
      lastY: -1e9,
      vx: 0,
      vy: 0,
      speed: 0,
      lastT: performance.now(),
    };

    const inertia = {
      x: 0,
      y: 0,
    };

    const shock = {
      active: false,
      x: 0,
      y: 0,
      t0: 0,
    };

    function rebuildGrid() {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const step = Math.max(2, dotSize + gap);
      const cols = Math.ceil(width / step) + 2;
      const rows = Math.ceil(height / step) + 2;

      const startX = -step;
      const startY = -step;

      const nextGrid = [];
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const x = startX + col * step;
          const y = startY + row * step;
          nextGrid.push({ x, y });
        }
      }
      grid = nextGrid;
    }

    function onPointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const now = performance.now();
      const dt = Math.max(1, now - pointer.lastT);
      const vx = (x - pointer.lastX) / dt;
      const vy = (y - pointer.lastY) / dt;
      const speed = Math.sqrt(vx * vx + vy * vy) * 1000; // px/s

      pointer.lastX = x;
      pointer.lastY = y;
      pointer.x = x;
      pointer.y = y;
      pointer.vx = vx;
      pointer.vy = vy;
      pointer.speed = speed;
      pointer.lastT = now;

      if (speed > speedTrigger) {
        const capped = clamp(speed, 0, maxSpeed);
        const scale = capped / Math.max(1, maxSpeed);
        inertia.x += vx * 120 * scale;
        inertia.y += vy * 120 * scale;
      }
    }

    function onPointerLeave() {
      pointer.x = -1e9;
      pointer.y = -1e9;
    }

    function onClick(event) {
      const rect = canvas.getBoundingClientRect();
      shock.x = event.clientX - rect.left;
      shock.y = event.clientY - rect.top;
      shock.t0 = performance.now();
      shock.active = true;
    }

    function drawDot(x, y, radius, fill) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
    }

    let lastFrame = performance.now();
    function frame(now) {
      const dtMs = clamp(now - lastFrame, 0, 50);
      const dt = dtMs / 1000;
      lastFrame = now;

      ctx.clearRect(0, 0, width, height);

      // Inertia decay: resistance affects how quickly motion damps.
      const resistanceFactor = Math.exp(-dt * (resistance / 1000));
      const returnFactor = Math.exp(-dt / Math.max(0.05, returnDuration));
      inertia.x *= resistanceFactor;
      inertia.y *= resistanceFactor;
      inertia.x *= returnFactor;
      inertia.y *= returnFactor;

      const hasShock = shock.active;
      const shockT = hasShock ? (now - shock.t0) / 1000 : 0;
      if (hasShock && shockT > 0.7) shock.active = false;

      const baseRadius = Math.max(1, dotSize / 2);
      const prox = Math.max(1, proximity);

      for (let i = 0; i < grid.length; i += 1) {
        const p = grid[i];
        let dx = p.x - pointer.x;
        let dy = p.y - pointer.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        let t = 0;
        let offsetX = 0;
        let offsetY = 0;

        if (dist < prox) {
          const influence = 1 - dist / prox;
          t = influence;

          const nx = dist === 0 ? 0 : dx / dist;
          const ny = dist === 0 ? 0 : dy / dist;

          // Subtle repulsion from pointer + inertia drift.
          const repel = influence * 6;
          offsetX += nx * repel;
          offsetY += ny * repel;

          offsetX += inertia.x * influence * 0.02;
          offsetY += inertia.y * influence * 0.02;
        }

        if (hasShock) {
          const sx = p.x - shock.x;
          const sy = p.y - shock.y;
          const sr = Math.sqrt(sx * sx + sy * sy);
          if (sr < shockRadius) {
            const snx = sr === 0 ? 0 : sx / sr;
            const sny = sr === 0 ? 0 : sy / sr;
            const falloff = 1 - sr / Math.max(1, shockRadius);

            // Damped oscillation to mimic a shockwave.
            const wave = Math.cos(sr * 0.04 - shockT * 18) * Math.exp(-shockT * 3);
            const amp = shockStrength * falloff * wave;
            offsetX += snx * amp;
            offsetY += sny * amp;

            t = Math.max(t, clamp(falloff, 0, 1) * 0.9);
          }
        }

        const fill = lerpColor(colors.base, colors.active, clamp(t, 0, 1));
        drawDot(p.x + offsetX, p.y + offsetY, baseRadius, fill);
      }

      rafRef.current = window.requestAnimationFrame(frame);
    }

    rebuildGrid();
    rafRef.current = window.requestAnimationFrame(frame);

    const onResize = () => rebuildGrid();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("click", onClick, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("click", onClick);
    };
  }, [
    dotSize,
    gap,
    colors,
    proximity,
    speedTrigger,
    shockRadius,
    shockStrength,
    maxSpeed,
    resistance,
    returnDuration,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        ...style,
      }}
      aria-hidden="true"
    />
  );
}
