import React from "react";
import { useState } from "react";


const ContactForm = ({ onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        email: '',
        type: '',
        date: '',
        venue: '',
        details: ''
    });

    const initialFormState = {
        name: '',
        number: '',
        email: '',
        type: '',
        date: '',
        venue: '',
        details: ''
    }

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [serverMessage, setServerMessage] = useState('');

    const validateForm = (name, value) => {
        let message = "";

        if (name === "name") {
            const fullName = value.trim().replace(/\s+/g, " ");
            if (!value) {
                message = "Full name is required.";
            } else if (value.length > 100) {
                message = "Maximum 100 characters allowed.";
            } else if (!/^[\p{L}]+(?:[-'][\p{L}]+)*(?: [\p{L}]+(?:[-'][\p{L}]+)*)*$/u.test(fullName)) {
                message = "Invalid full name. Only letters, spaces, hyphens, and apostrophes allowed.";
            }
        }

        if (name === "number") {
            if (!value) {
                message = "Phone number required.";
            } else if (value.length > 50) {
                message = "Maximum 50 characters allowed.";
            } else if (!/^\d{10,}$/.test(value)) {
                message = "Phone number must contain only digits (min 10).";
            }
        }

        if (name === "email") {
            if (!value) {
                message = "Email is required.";
            } else if (value.length > 50) {
                message = "Maximum 50 characters allowed.";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                message = "Invalid email format.";
            }
        }

        if (name === "type") {
            if (!value || value === "Select option") {
                message = "Please select a booking type.";
            }
        }

        if (name === "date") {
            if (!value) {
                message = "Please select a date.";
            } else if (value.length > 50) {
                message = "Maximum 50 characters allowed.";
            }
        }

        if (name === "venue") {
            const venueTrimmed = value.trim().replace(/\s+/g, " ");
            if (!venueTrimmed) {
                message = "Venue / Location is required.";
            } else if (value.length > 100) {
                message = "Maximum 100 characters allowed.";
            } else if (!/^[\p{L}\d]+(?:[-'@&][\p{L}\d]+)*(?:[ ,][\p{L}\d]+(?:[-'@&][\p{L}\d]+)*)*$/u.test(venueTrimmed)) {
                message = "Invalid venue. Only letters, numbers, spaces, hyphens, apostrophes, commas, @, and & allowed.";
            }
        }

        if (name === "details") {
            if (!value) {
                message = "Please provide some details.";
            } else if (value.length > 200) {
                message = "Maximum 200 characters allowed.";
            } else if (!/^[\p{L}\d\s'!\-]{1,200}$/u.test(value)) {
                message = "Only letters, numbers, spaces, ', -, ! are allowed (max 200 chars).";
            }
        }

        setErrors((prev) => ({...prev, [name]: message }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerMessage('');

        const fields = Object.keys(formData);
        fields.forEach((field) => validateForm(field, formData[field]));
        const hasErrors = Object.values(errors).some((msg) => msg);
        if (hasErrors) return;

        setSubmitting(true);
        try {
            const token = await window.grecaptcha.execute('6Le9YB8sAAAAAP33qDBA_cPPKvud-xjmqmgWQCHJ', { action: 'contact_submit' });
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, captchaToken: token, captchaAction: 'contact_submit' }),
                credentials: 'same-origin'
            });

            const data = await res.json();
            if (!res.ok) {
                if (data?.errors) setErrors((prev) => ({ ...prev, ...data.errors }));
                setServerMessage(data?.message || 'Something went wrong. Please try again.');
            } else {
                setServerMessage('Thank you! Your enquiry has been sent.');
                setFormData(initialFormState);
            }
        } catch (err) {
            setServerMessage('Network error. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClear = () => {
        setFormData(initialFormState);
        setErrors({});
        setServerMessage('');
    };


    return (
        <div
        className="font-montserrat rounded-none sm:rounded-md shadow-lg bg-[#F0F6EA] text-[#4A6741] relative"
        >
        {/* Close button */}
        <button
            aria-label="Close"
            onClick={onCancel}
            className="absolute right-4 top-4 p-1"
        >
            <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[1.1]" fill="none" stroke="#2F4926">
            <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
        </button>

        {/* Header */}
        <div className="px-5 sm:px-8 pt-10 sm:pt-12">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-regular tracking-wide text-center">GET IN TOUCH</h1>
            <div className="mt-4 space-y-2 text-center text-xs sm:text-sm lg:text-base font-light">
            <p>Every story begins with a simple hello. If something in our work resonates with you, we'd love to hear your vision.</p>
            <p>Please complete the form below to enquire. We'd love to hear from you!</p>
            </div>
        </div>

        {/* Form content: single column on mobile, two columns on lg */}
      <form onSubmit={handleSubmit} className="px-5 sm:px-8 pb-8 sm:pb-10">
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
          {/* Left column */}
          <div>
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold tracking-wide text-center">PERSONAL DETAILS</h3>

            <label htmlFor="name" className="mt-4 block text-xs sm:text-sm font-light">FULL NAME <span className="font-normal">*</span></label>
            <input
              type="text" id="name" placeholder="Name & Surname"
              name="name" value={formData.name} onChange={handleChange}
              onBlur={(e) => validateForm("name", e.target.value)} maxLength={100}
              className="mt-2 w-full bg-transparent border border-[#4A6741]/50 rounded-sm px-3 py-2 text-[#4A6741] placeholder-[#4A6741]/60 focus:outline-none focus:ring-1 focus:ring-[#4A6741] focus:border-[#4A6741]"
            />
            {errors.name && <p className="mt-1 text-xs text-red-700">{errors.name}</p>}

            <label htmlFor="number" className="mt-4 block text-xs sm:text-sm font-light">PHONE NUMBER <span className="font-normal">*</span></label>
            <input
              type="text" id="number" placeholder="012 345 6789"
              name="number" value={formData.number} onChange={handleChange}
              onBlur={(e) => validateForm("number", e.target.value)} maxLength={50}
              className="mt-2 w-full bg-transparent border border-[#4A6741]/50 rounded-sm px-3 py-2 text-[#4A6741] placeholder-[#4A6741]/60 focus:outline-none focus:ring-1 focus:ring-[#4A6741] focus:border-[#4A6741]"
            />
            {errors.number && <p className="mt-1 text-xs text-red-700">{errors.number}</p>}

            <label htmlFor="email" className="mt-4 block text-xs sm:text-sm font-light">EMAIL <span className="font-normal">*</span></label>
            <input
              type="email" id="email" placeholder="example@email.com"
              name="email" value={formData.email} onChange={handleChange}
              onBlur={(e) => validateForm("email", e.target.value)} maxLength={50}
              className="mt-2 w-full bg-transparent border border-[#4A6741]/50 rounded-sm px-3 py-2 text-[#4A6741] placeholder-[#4A6741]/60 focus:outline-none focus:ring-1 focus:ring-[#4A6741] focus:border-[#4A6741]"
            />
             {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email}</p>}

            {/* Contact info note, shown left on desktop, below inputs on mobile */}
            <div className="mt-6 text-center lg:text-left text-xs sm:text-sm font-light">
              <p>If we do not get back to you within 24hrs, please contact us at:</p>
              <p className="mt-2">info.schonphotography@gmail.com</p>
              <p>+27 72 065 7083</p>
            </div>
          </div>

          {/* Right column */}
          <div>
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold tracking-wide text-center">BOOKING DETAILS</h3>

            <label htmlFor="type" className="mt-4 block text-xs sm:text-sm font-light">BOOKING TYPE <span className="font-normal">*</span></label>
            <div className="relative mt-2">
              <select
                id="type" name="type" value={formData.type} onChange={handleChange}
                onBlur={(e) => validateForm("type", e.target.value)}
                className="w-full bg-transparent border border-[#4A6741]/50 rounded-sm px-3 py-2 text-[#4A6741] focus:outline-none focus:ring-1 focus:ring-[#4A6741] focus:border-[#4A6741] appearance-none"
              >
                <option>Select option</option>
                <option value="Wedding">Wedding</option>
                <option value="Engagement">Engagement</option>
                <option value="Couple Session">Couple Session</option>
                <option value="Matric Farewell">Matric Farewell</option>
                <option value="Other">Other</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#4A6741" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            {errors.type && <p className="mt-1 text-xs text-red-700">{errors.type}</p>}

            <label htmlFor="date" className="mt-4 block text-xs sm:text-sm font-light">DATE <span className="font-normal">*</span></label>
            <input
              type="date" id="date" placeholder="dd / mm / yyyy"
              name="date" value={formData.date} onChange={handleChange}
              onBlur={(e) => validateForm("date", e.target.value)} maxLength={50}
              className="mt-2 w-full bg-transparent border border-[#4A6741]/50 rounded-sm px-3 py-2 text-[#4A6741] placeholder-[#4A6741]/60 focus:outline-none focus:ring-1 focus:ring-[#4A6741] focus:border-[#4A6741]"
            />
            {errors.date && <p className="mt-1 text-xs text-red-700">{errors.date}</p>}

            <label htmlFor="venue" className="mt-4 block text-xs sm:text-sm font-light">VENUE / LOCATION <span className="font-normal">*</span></label>
            <input
              type="text" id="venue" placeholder="E.g. De Harte Wedding Venue, Pretoria"
              name="venue" value={formData.venue} onChange={handleChange}
              onBlur={(e) => validateForm("venue", e.target.value)} maxLength={100}
              className="mt-2 w-full bg-transparent border border-[#4A6741]/50 rounded-sm px-3 py-2 text-[#4A6741] placeholder-[#4A6741]/60 focus:outline-none focus:ring-1 focus:ring-[#4A6741] focus:border-[#4A6741]"
            />
            {errors.venue && <p className="mt-1 text-xs text-red-700">{errors.venue}</p>}

            <label htmlFor="details" className="mt-4 block text-xs sm:text-sm font-light">GIVE US SOME DETAILS! <span className="font-normal">*</span></label>
            <textarea
              id="details" name="details"
              placeholder="Tell us anything you think is important for us to know. We can’t wait to get to know you and to capture your memories!"
              minLength={1} maxLength={200} value={formData.details}
              onChange={handleChange} onBlur={(e) => validateForm("details", e.target.value)}
              className="mt-2 w-full bg-transparent border border-[#4A6741]/50 rounded-sm px-3 py-2 text-[#4A6741] placeholder-[#4A6741]/60 focus:outline-none focus:ring-1 focus:ring-[#4A6741] focus:border-[#4A6741] min-h-24"
            />
            {errors.details && <p className="mt-1 text-xs text-red-700">{errors.details}</p>}

            {/* Buttons */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-[#4A6741]/20 text-[#4A6741] rounded-sm border border-[#4A6741]/40 hover:bg-[#4A6741]/30 transition"
              >
                {submitting ? 'Submitting...' : 'SUBMIT'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 bg-[#4A6741]/20 text-[#4A6741] rounded-sm border border-[#4A6741]/40 hover:bg-[#4A6741]/30 transition"
              >
                CLEAR
              </button>
            </div>
          </div>
        </div>

        {/* Server message */}
        {serverMessage && <p className="mt-4 text-center text-xs sm:text-sm">{serverMessage}</p>}
      </form>
    </div>
  );
}

export default ContactForm;
