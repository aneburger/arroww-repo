import React from "react";
import { openContactModal } from "./Contact";

function scrollToSection(sectionId) {
  if (typeof document === "undefined") return;
  if (sectionId === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const el = document.getElementById(sectionId);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const Footer = () => {
  return (
    <footer className="bg-black">
      <div className="px-6 sm:px-10 md:px-16 lg:px-20 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#ffcaca]/25 bg-black px-4 py-2">
            <span className="font-geologica font-thin tracking-[0.25em] uppercase text-xs text-[#ffcaca]">
              Contact
            </span>
            <span className="h-1 w-1 rounded-full bg-[#FF8181]" aria-hidden="true" />
            <span className="font-geologica font-thin text-xs text-[#f9a0a0]">Let's build something</span>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <h2 className="font-geologica font-light text-[#FF8181] text-4xl sm:text-5xl md:text-6xl leading-[1.1]">
                Ready to point your business
                <span className="block font-thin text-[#f9a0a0]">in the right direction?</span>
              </h2>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => openContactModal()}
                  className="inline-flex items-center gap-2 rounded-[12px] border border-[#FF8181]/30 bg-black px-5 py-3 font-geologica font-thin text-[#ffcaca]"
                  aria-label="Open contact form"
                >
                  <span>Get in touch</span>
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-[#ffcaca]"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"
                    />
                  </svg>
                </button>

                <a
                  href="https://instagram.com/websitesbyarroww"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-[12px] border border-[#FF8181]/20 bg-black px-4 py-3"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-[22px] h-[22px] text-[#ffcaca]"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <nav className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { label: "Home", id: "home" },
                  { label: "About", id: "about" },
                  { label: "Work", id: "work" },
                  { label: "Contact", id: "contact" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.id === "contact") {
                        openContactModal();
                      } else {
                        scrollToSection(item.id);
                      }
                    }}
                    className="rounded-2xl border border-[#FF8181]/20 bg-black px-4 py-4 text-left"
                    aria-label={`Scroll to ${item.label}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="font-geologica font-thin text-[#f9a0a0] text-xs tracking-[0.2em] uppercase">
                        {item.label}
                      </div>
                      <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="w-[22px] h-[22px] text-[#ffcaca]"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="0.7"
                          d="M19 12H5m14 0-4 4m4-4-4-4"
                        />
                      </svg>
                    </div>
                    {/* <div className="mt-2 font-geologica font-light text-[#ffcaca]">Explore</div> */}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          <div className="mt-14 pt-8 border-t border-[#FF8181]/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="font-geologica font-thin text-[#f9a0a0] text-sm">
              © 2025 Arroww Web Development
            </p>
            {/* <p className="font-geologica font-thin text-[#ffcaca]/70 text-sm">
              Crafted with clarity, built for growth.
            </p> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;