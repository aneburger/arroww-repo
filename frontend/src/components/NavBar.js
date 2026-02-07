import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ContactForm from "./ContactForm";

const NAV_TEXT = "#2F4926";

const HamburgerIcon = ({ className = "" }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={`${className} stroke-[1.1]`}
    fill="none"
    stroke={NAV_TEXT}
  >
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

const CloseIcon = ({ className = "" }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={`${className} stroke-[1.1]`}
    fill="none"
    stroke={NAV_TEXT}
  >
    <path d="M6 6l12 12M18 6l-12 12" />
  </svg>
);

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = () => setOpen((v) => !v);
  const closeMenu = () => {
    setOpen(false);
    setPortfolioOpen(false);
  };

  const openContact = () => {
    setContactOpen(true);
    setOpen(false);
    setPortfolioOpen(false);
  };
  const closeContact = () => setContactOpen(false);


  const goToServices = () => {
    const doScroll = () => {
      const el = document.getElementById("services");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    closeMenu();
    if (location.pathname !== "/") {
      navigate("/");
      // Give React a tick to render home before scrolling
      setTimeout(doScroll, 80);
    } else {
      doScroll();
    }
  };

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 font-montserrat transition-colors duration-300 ${
        scrolled ? "bg-[#F0F6EA]" : "bg-transparent"
      }`}
    >
      {/* Bar */}
      <div className="relative flex items-center justify-center h-12 md:h-14 lg:h-16">
        {/* Center title only when scrolled */}
        {scrolled && (
          <h1 className="text-sm md:text-base lg:text-lg tracking-wide text-center" style={{ color: NAV_TEXT }}>
            SCHÖN PHOTOGRAPHY
          </h1>
        )}

        {/* Menu toggle on the right (always visible) */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={toggleMenu}
          className="absolute right-3 md:right-4 lg:right-6 p-2"
        >
          {open ? (
            <CloseIcon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          ) : (
            <HamburgerIcon className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          )}
        </button>
      </div>

      {/* Dropdown panel */}
      {open && (
        <nav
          className="
            border-t border-[#2F4926]/10
            text-[#2F4926]
            w-full
            max-h-[70vh]
            overflow-y-auto
            backdrop:opacity-0
          "
          style={{ backgroundColor: "#F0F6EA" }}
        >
          {/* Mobile: full width; Larger screens: center with max-width */}
          <div className="w-full md:max-w-2xl lg:max-w-3xl mx-auto px-6 py-6 md:py-8">
            
            <ul className="space-y-6 md:space-y-7 text-center">
              <li>
                <Link to="/" onClick={closeMenu} className="block text-xs md:text-sm lg:text-base tracking-wide">
                  HOME
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={closeMenu} className="block text-xs md:text-sm lg:text-base tracking-wide">
                  ABOUT
                </Link>
              </li>

              <li>
                <button
                  onClick={goToServices}
                  className="block w-full text-xs md:text-sm lg:text-base tracking-wide"
                >
                  PRICING & SERVICES
                </button>
              </li>

              {/* Portfolio dropdown */}
              <li>
                <button
                  onClick={() => setPortfolioOpen((v) => !v)}
                  className="w-full text-xs md:text-sm lg:text-base tracking-wide"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <Link to="/portfolio" onClick={closeMenu} className="block text-xs md:text-sm lg:text-base tracking-wide">
                        PORTFOLIO
                    </Link>
                  </span>
                </button>
              </li>

              <li>
                <button onClick={openContact} className="block w-full text-xs md:text-sm lg:text-base tracking-wide">
                    CONTACT
                </button>
              </li>

              {/* Social icons row */}
              <li className="pt-1 pr-2">
                <div className="flex items-center justify-center gap-3">
                  <a href="https://facebook.com/schonphotography1" target="_blank" rel="noreferrer" aria-label="Facebook" className="p-1">
                    <img alt="Facebook" src="/assets/images/facebook.png" className="h-4 w-4" />
                  </a>
                  <a href="https://www.instagram.com/schon.weddings" target="_blank" rel="noreferrer" aria-label="Instagram" className="p-1">
                    <img alt="Instagram" src="/assets/images/insta.png" className="h-4 w-4" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      )}
      {/* Click-away overlay for mobile when menu open */}
      {open && (
        <button
          aria-hidden="true"
          onClick={closeMenu}
          className="fixed inset-0 -z-10 cursor-default"
          tabIndex={-1}
        />
      )}
    </header>
      {/* Contact modal overlay */}
      {contactOpen && (
        <div className="fixed inset-0 z-[60]">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/30" onClick={closeContact} />
          {/* modal container: full width on mobile; centered and constrained on larger screens */}
          <div className="absolute inset-x-0 top-0 mx-auto h-full overflow-y-auto p-4 sm:p-6">
            <div className="relative mx-auto w-full sm:max-w-2xl lg:max-w-5xl">
              <ContactForm onCancel={closeContact} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;

