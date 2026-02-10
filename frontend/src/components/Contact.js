import React, { useEffect, useState } from "react";
import ContactForm from "./ContactForm";

const CONTACT_OPEN_EVENT = "arroww:contact-open";

export function openContactModal() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CONTACT_OPEN_EVENT));
}

const Contact = ({ buttonText = "Contact Us", hideButton = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const onOpen = () => setIsOpen(true);
    window.addEventListener(CONTACT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONTACT_OPEN_EVENT, onOpen);
  }, []);

  return (
    <>
      {!hideButton && (
        <button
          type="button"
          onClick={open}
          className="flex items-center gap-2 rounded-[12px] border border-[#ffcaca] bg-[#ff8e8e75] px-5 py-2 font-geologica font-thin text-[#ffcaca]"
        >
          <span>{buttonText}</span>
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill="none"
            viewBox="0 0 24 24"
            className="w-[18px] h-[18px] text-[#ffcaca]"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="0.7"
              d="M19 12H5m14 0-4 4m4-4-4-4"
            />
          </svg>
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
          onClick={close}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <ContactForm onCancel={close} />
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
