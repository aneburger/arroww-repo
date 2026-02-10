import React, { useMemo, useState } from "react";

const RECAPTCHA_SITE_KEY = "6Ld1I2csAAAAAFcSFfobwDCS3I99eMVV78NjIXji";

function normalizeWhitespace(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function validateField(fieldName, rawValue, budgetOptions) {
  const value = normalizeWhitespace(rawValue);

  if (fieldName === "name") {
    if (!value) return "Full name is required.";
    if (value.length > 100) return "Maximum 100 characters allowed.";
    if (!/^[\p{L}]+(?:[-'][\p{L}]+)*(?: [\p{L}]+(?:[-'][\p{L}]+)*)*$/u.test(value)) {
      return "Invalid full name. Only letters, spaces, hyphens, and apostrophes allowed.";
    }
  }

  if (fieldName === "email") {
    if (!value) return "Email is required.";
    if (value.length > 50) return "Maximum 50 characters allowed.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format.";
  }

  if (fieldName === "brief") {
    if (!value) return "Please add a short brief.";
    if (value.length > 500) return "Maximum 500 characters allowed.";
  }

  if (fieldName === "budget") {
    if (!value || value === "Select option") return "Please select a budget.";
    if (budgetOptions?.length && !budgetOptions.includes(value)) return "Invalid budget option.";
  }

  return "";
}

const ContactForm = ({ onCancel }) => {
  const initialFormState = useMemo(
    () => ({
      name: "",
      email: "",
      brief: "",
      budget: "",
    }),
    []
  );

  const budgetOptions = useMemo(
    () => [
      "R5,000 - R10,000",
      "R10,000 - R20,000",
      "R20,000+",
      "Not sure yet",
    ],
    []
  );

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const validateAll = (data) => {
    const nextErrors = {};
    for (const fieldName of Object.keys(data)) {
      const message = validateField(fieldName, data[fieldName], budgetOptions);
      if (message) nextErrors[fieldName] = message;
    }
    return nextErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, budgetOptions),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, budgetOptions),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");

    const nextErrors = validateAll(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      if (!window.grecaptcha?.execute) {
        setServerMessage("Captcha not ready yet. Please try again.");
        return;
      }

      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
        action: "contact_submit",
      });

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          captchaToken: token,
          captchaAction: "contact_submit",
        }),
        credentials: "same-origin",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data?.errors) setErrors((prev) => ({ ...prev, ...data.errors }));
        setServerMessage(data?.message || "Something went wrong. Please try again.");
        return;
      }

      setServerMessage("Thank you! Your enquiry has been sent.");
      setFormData(initialFormState);
      setErrors({});
    } catch (err) {
      setServerMessage("Network error. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormState);
    setErrors({});
    setServerMessage("");
  };

  return (
    <div className="relative w-full font-geologica bg-black text-[#ffcaca] border border-[#ffcaca] rounded-2xl shadow-2xl">
      <button
        aria-label="Close"
        onClick={onCancel}
        className="absolute right-4 top-4 p-1"
        type="button"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 stroke-[1.1]"
          fill="none"
          stroke="#ffcaca"
        >
          <path d="M6 6l12 12M18 6l-12 12" />
        </svg>
      </button>

      <form onSubmit={handleSubmit} className="px-6 sm:px-10 pt-10 pb-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#ffcaca]/25 bg-black px-4 py-2">
            <span className="font-thin tracking-[0.25em] uppercase text-xs text-[#ffcaca]">Contact</span>
            <span className="h-1 w-1 rounded-full bg-[#FF8181]" aria-hidden="true" />
            <span className="font-thin text-xs text-[#f9a0a0]">Let’s talk</span>
          </div>
          <h3 className="mt-6 text-3xl sm:text-4xl font-light text-[#FF8181] leading-[1.1]">
            Tell me what you need
            <span className="block font-thin text-[#f9a0a0]">and I'll get back to you</span>
          </h3>
        </div>

        <div className="mt-10 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-xs tracking-[0.25em] uppercase font-thin text-[#f9a0a0]"
            >
              Name <span className="text-[#FF8181]">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={100}
              placeholder="Full name"
              className="mt-3 w-full bg-transparent border-b border-[#ffcaca]/40 pb-2 text-[#ffcaca] placeholder-[#ffcaca]/60 focus:outline-none focus:border-[#ffcaca]"
              autoComplete="name"
            />
            {errors.name && <p className="mt-2 text-xs text-red-700">{errors.name}</p>}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs tracking-[0.25em] uppercase font-thin text-[#f9a0a0]"
            >
              Email <span className="text-[#FF8181]">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={50}
              placeholder="example@email.com"
              className="mt-3 w-full bg-transparent border-b border-[#ffcaca]/40 pb-2 text-[#ffcaca] placeholder-[#ffcaca]/60 focus:outline-none focus:border-[#ffcaca]"
              autoComplete="email"
            />
            {errors.email && <p className="mt-2 text-xs text-red-700">{errors.email}</p>}
          </div>

          <div>
            <label
              htmlFor="brief"
              className="block text-xs tracking-[0.25em] uppercase font-thin text-[#f9a0a0]"
            >
              Brief <span className="text-[#FF8181]">*</span>
            </label>
            <textarea
              id="brief"
              name="brief"
              value={formData.brief}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={500}
              placeholder="A few lines about your project, timeline, and goals"
              className="mt-3 w-full bg-transparent border-b border-[#ffcaca]/40 pb-2 text-[#ffcaca] placeholder-[#ffcaca]/60 focus:outline-none focus:border-[#ffcaca] min-h-24"
            />
            {errors.brief && <p className="mt-2 text-xs text-red-700">{errors.brief}</p>}
          </div>

          <div>
            <label
              htmlFor="budget"
              className="block text-xs tracking-[0.25em] uppercase font-thin text-[#f9a0a0]"
            >
              What's your budget? <span className="text-[#FF8181]">*</span>
            </label>
            <div className="relative mt-3">
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full bg-transparent border-b border-[#ffcaca]/40 pb-2 text-[#ffcaca] focus:outline-none focus:border-[#ffcaca] appearance-none"
              >
                <option value="">Select option</option>
                {budgetOptions.map((opt) => (
                  <option key={opt} value={opt} className="text-black">
                    {opt}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffcaca"
                strokeWidth="1.2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            {errors.budget && <p className="mt-2 text-xs text-red-700">{errors.budget}</p>}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-[12px] border border-[#ffcaca] bg-[#ff8e8e75] px-6 py-2 font-thin text-[#ffcaca] transition-opacity disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center justify-center rounded-[12px] border border-[#ffcaca]/30 bg-black px-6 py-2 font-thin text-[#ffcaca]"
          >
            Clear
          </button>
        </div>

        {serverMessage && (
          <p className="mt-6 text-center text-sm font-thin text-[#f9a0a0]">{serverMessage}</p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
