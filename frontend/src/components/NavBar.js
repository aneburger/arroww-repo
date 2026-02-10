import React, { useEffect, useMemo, useRef, useState } from "react";

function scrollToSection(sectionId) {
  if (typeof document === "undefined") return;
  if (sectionId === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const el = document.getElementById(sectionId);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function BurgerIcon({ open }) {
  const common = {
    stroke: "#ffcaca",
    strokeWidth: 0.7,
    strokeLinecap: "round",
  };

  const lineStyle = {
    transition: "transform 180ms ease, opacity 140ms ease",
    transformOrigin: "center",
    transformBox: "fill-box",
  };

  return (
    <svg
      className="w-[35px] h-[35px]"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        {...common}
        d="M5 7h14"
        style={{
          ...lineStyle,
          transform: open ? "translateY(5px) rotate(45deg)" : "translateY(0px) rotate(0deg)",
        }}
      />
      <path
        {...common}
        d="M5 12h14"
        style={{
          ...lineStyle,
          opacity: open ? 0 : 1,
        }}
      />
      <path
        {...common}
        d="M5 17h14"
        style={{
          ...lineStyle,
          transform: open ? "translateY(-5px) rotate(-45deg)" : "translateY(0px) rotate(0deg)",
        }}
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      fill="none"
      viewBox="0 0 24 24"
      className="w-[24px] h-[24px] text-[#ffcaca]"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0.7"
        d="M19 12H5m14 0-4 4m4-4-4-4"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="29"
      height="29"
      fill="none"
      viewBox="0 0 24 24"
      className="w-[28px] h-[28px] text-[#ffcaca]"
    >
      <path
        d="M7.5 2.75h9A4.75 4.75 0 0 1 21.25 7.5v9A4.75 4.75 0 0 1 16.5 21.25h-9A4.75 4.75 0 0 1 2.75 16.5v-9A4.75 4.75 0 0 1 7.5 2.75Z"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <path
        d="M12 16.25A4.25 4.25 0 1 0 12 7.75a4.25 4.25 0 0 0 0 8.5Z"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <path
        d="M17.25 6.75h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const links = useMemo(
    () => [
      { label: "Home", id: "home" },
      { label: "About", id: "about" },
      { label: "Work", id: "work" },
      { label: "Contact", id: "contact" },
    ],
    []
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onPointerDown = (e) => {
      const container = containerRef.current;
      const target = e.target;

      if (container?.contains(target)) return;
      setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div ref={containerRef} className="relative w-14 h-14">
        <div
          id="arroww-burger-menu"
          role="menu"
          aria-hidden={!open}
          className={open ? "pointer-events-auto" : "pointer-events-none"}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 224,
            background: "black",
            border: "1px solid #ffcaca",
            borderRadius: 12,
            overflow: "hidden",
            opacity: open ? 1 : 0,
            transform: open ? "translate3d(0,0,0)" : "translate3d(0,8px,0)",
            transformOrigin: "bottom right",
            transition: "opacity 160ms ease, transform 200ms ease",
          }}
        >
          <div className="py-3">
            {links.map((l, idx) => (
              <button
                key={l.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  scrollToSection(l.id);
                  setOpen(false);
                }}
                className="w-full text-left"
              >
                <div
                  className={
                    "mx-5 py-3 flex items-center justify-between font-geologica font-thin tracking-wide text-[#ffcaca] " +
                    (idx !== links.length - 1 ? "border-b border-[#ffcaca]/30" : "")
                  }
                >
                  <span>{l.label}</span>
                  <ArrowRightIcon />
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-[#ffcaca]/30 h-16 flex items-center" style={{ paddingLeft: 20, paddingRight: 76 }}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex items-center justify-center"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="arroww-burger-menu"
          onClick={() => setOpen((v) => !v)}
          className="absolute bottom-0 right-0 flex items-center justify-center"
          style={{
            width: open ? 48 : 56,
            height: open ? 48 : 56,
            borderRadius: open ? 8 : 12,
            background: open ? "black" : "#ff8e8e75",
            border: open ? "1px solid transparent" : "1px solid #ffcaca",
            transform: open ? "translate3d(-8px,-8px,0)" : "translate3d(0,0,0)",
            transition:
              "transform 200ms ease, width 200ms ease, height 200ms ease, border-color 160ms ease, border-radius 200ms ease",
          }}
        >
          <BurgerIcon open={open} />
        </button>
      </div>
    </div>
  );
};

export default NavBar;

