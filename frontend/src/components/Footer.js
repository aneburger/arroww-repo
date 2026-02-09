import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ContactForm from "./ContactForm";

const Footer = () => {
  return (
    <footer className="font-geologica font-thin text-[#CC5050] text-3xl sm:text-4xl">
      <div>Ready to point your business in the right direction?</div>
      <button>Get in touch</button>

      <div>
        <p>Home</p>
        <p>About</p>
        <p>Work</p>
        
        {/* Instagram logo */}
        <svg class="w-[34px] h-[34px] text-[#CC5050] dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path fill="currentColor" fill-rule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clip-rule="evenodd"/>
        </svg>
      </div>

      <p className="mt-6 text-[12px] sm:text-[13px] lg:text-[14px]">
        © 2025 Arroww Web Development
      </p>
    </footer>
  );
};

export default Footer;