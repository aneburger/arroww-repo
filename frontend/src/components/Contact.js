/*****************************************
 * Created On: 2025 / 12 / 01
 * Last Modified: 2025 / 12 / 01
 * 
 * Author: Ané Burger t.a. Arroww Web Dev
 * 
******************************************/

import React, { useEffect, useState } from "react";
import ContactForm from "./ContactForm";

const Contact = ({ buttonText }) => {
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

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex items-center px-4 py-2 rounded-md bg-[#D0DAC7] text-[#4A6741] font-montserrat text-sm lg:text-base shadow-sm hover:bg-[#c6d1bf] focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
      >
        {buttonText}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
          onClick={close}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#F0F6EA] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Form (uses its own cancel/close) */}
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <ContactForm onCancel={close} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
