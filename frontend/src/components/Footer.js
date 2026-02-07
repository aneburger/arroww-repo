import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ContactForm from "./ContactForm";

const Footer = () => {
  const [showTop, setShowTop] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

    const scrollToServices = () => {
        const doScroll = () => {
        const el = document.getElementById("services");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        };
        if (location.pathname !== "/") {
        navigate("/");
        setTimeout(doScroll, 80);
        } else {
        doScroll();
        }
    };

  const openContact = () => setIsContactOpen(true);
  const closeContact = () => setIsContactOpen(false);

  return (
    <footer className="bg-[#F0F6EA] text-[#4A6741] font-montserrat w-full">
      {/* Instagram header */}
      <div className="w-full px-6 lg:px-10 py-10 lg:py-14 text-center">
        <h3 className="text-[16px] sm:text-[18px] lg:text-[20px] tracking-wide">
          FOLLOW US ON INSTAGRAM
        </h3>
        <a
          href="https://www.instagram.com/schon.weddings"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-[18px] sm:text-[20px] lg:text-[22px] font-semibold"
        >
          @schon.weddings
        </a>

        {/* Divider */}
        <div className="mt-8 border-t border-[#4A6741]/30" />

        {/* Nav row: logo + links + socials */}
        <div className="mt-8 px-2 flex flex-col items-center gap-8 xl:gap-12 lg:flex-row lg:justify-center">
          {/* Logo */}
          <img alt="Logo" src="/assets/images/greenLogo.png" className="h-12 w-12" />

          {/* Links */}
          <nav className="flex flex-col items-center gap-4 lg:flex-row lg:gap-10 text-[14px] lg:text-[16px] tracking-wide">
            <Link to="/" className="hover:opacity-80">HOME</Link>
            <Link to="/about" className="hover:opacity-80">ABOUT</Link>
            <button type="button" onClick={scrollToServices} className="hover:opacity-80">
              PRICING &amp; SERVICES
            </button>
            <Link to="/portfolio" className="hover:opacity-80">PORTFOLIO</Link>
            <button type="button" onClick={openContact} className="hover:opacity-80">
              CONTACT
            </button>
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-5">
            <a href="https://www.facebook.com/schonphotography1" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-80">
              <img alt="Facebook" src="/assets/images/facebook.png" className="h-6 w-6" />
            </a>
            <a href="https://www.instagram.com/schon.weddings" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-80">
              <img alt="Instagram" src="/assets/images/insta.png" className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-[#4A6741]/30" />

        {/* Copyright */}
        <p className="mt-6 text-[12px] sm:text-[13px] lg:text-[14px]">
          © 2025 Schön Photography
        </p>
      </div>

      {/* Arroww bar full-width */}
      <div className="w-full bg-[#4A6741] text-[#F0F6EA]">
        <div className="w-full px-6 lg:px-10 py-3 text-center text-[15px]">
          Powered by Arroww{/* <a href="https://arroww.co.za" target="_blank" rel="noopener noreferrer" className="font-semibold">Arroww</a> */}
        </div>
      </div>

      {/* Floating Back to Top button (moved up/left + thinner arrow) */}
      {showTop && !isContactOpen && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to Top"
          className="fixed bottom-16 right-8 z-50 h-14 w-14 rounded-full bg-[#F0F6EA] text-[#4A6741] shadow-lg border border-[#4A6741]/30 flex items-center justify-center hover:bg-white transition"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 5 L5 12 M12 5 L19 12" stroke="#4A6741" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 5 V19" stroke="#4A6741" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>
      )}

      {/* Contact modal rendered from footer */}
      {isContactOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={closeContact}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#F0F6EA] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <ContactForm onCancel={closeContact} />
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;