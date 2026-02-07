import validator from "validator";

// Your existing sanitisation logic (unchanged)
function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  const trimmed = input.trim();
  const noControl = validator.stripLow(trimmed, true);
  return noControl.replace(/[<>]/g, "");
}

// Your existing helper (unchanged)
function onlyDigits(str) {
  return (str || "").replace(/\D+/g, "");
}

// Small helper to send JSON responses
function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Cloudflare Pages Function: handles POST /api/contact
export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { success: false, message: "Invalid JSON body." });
  }

  // --- reCAPTCHA verification (same logic, adapted to env/request) ---
  try {
    const token = sanitizeInput(body.captchaToken);
    const action = sanitizeInput(body.captchaAction);
    if (!token) {
      return json(400, { success: false, message: "Captcha required." });
    }

    const secret = env.RECAPTCHA_SECRET;
    const minScore = parseFloat(env.RECAPTCHA_MIN_SCORE);

    const remoteIp =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("x-forwarded-for") ||
      undefined;

    const verifyRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret,
          response: token,
          ...(remoteIp ? { remoteip: remoteIp } : {}),
        }),
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return json(429, {
        success: false,
        message: "Captcha verification failed.",
      });
    }

    if (verifyData.action && action && verifyData.action !== action) {
      return json(429, {
        success: false,
        message: "Captcha action mismatch.",
      });
    }

    if (typeof verifyData.score === "number" && verifyData.score < minScore) {
      return json(429, {
        success: false,
        message: "Captcha score too low.",
      });
    }
  } catch (e) {
    return json(429, {
      success: false,
      message: "Captcha verification error.",
    });
  }

  
  const errors = {};
  let { name, number, email, type, date, venue, details } = body;

  name = sanitizeInput(name);
  number = sanitizeInput(number);
  email = sanitizeInput(email);
  type = sanitizeInput(type);
  date = sanitizeInput(date);
  venue = sanitizeInput(venue);
  details = sanitizeInput(details);

  if (name && name.length > 100)
    errors.name = "Full name cannot exceed 100 characters.";
  if (number && number.length > 50)
    errors.number = "Phone number cannot exceed 50 characters.";
  if (email && email.length > 50)
    errors.email = "Email cannot exceed 50 characters.";
  if (date && date.length > 50)
    errors.date = "Date cannot exceed 50 characters.";
  if (venue && venue.length > 100)
    errors.venue = "Venue cannot exceed 100 characters.";
  if (details && details.length > 200)
    errors.details = "Details cannot exceed 200 characters.";

  if (!name) {
    errors.name = "Full name is required.";
  } else {
    const fullName = name.replace(/\s+/g, " ").trim();
    if (
      !/^[\p{L}]+(?:[-'][\p{L}]+)*(?: [\p{L}]+(?:[-'][\p{L}]+)*)*$/u.test(
        fullName
      )
    ) {
      errors.name = "Invalid full name.";
    }
  }

  const digitsOnly = onlyDigits(number);
  if (!number) {
    errors.number = "Phone number required.";
  } else if (digitsOnly.length < 10) {
    errors.number = "Phone number must be at least 10 digits.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!validator.isEmail(email)) {
    errors.email = "Invalid email format.";
  }

  const validTypes = [
    "Wedding",
    "Engagement",
    "Couple Session",
    "Matric Farewell",
    "Other",
  ];
  if (!type || !validTypes.includes(type)) {
    errors.type = "Invalid booking type.";
  }

  if (!date) {
    errors.date = "Date is required.";
  } else if (!validator.isISO8601(date, { strict: true })) {
    errors.date = "Invalid date format.";
  }

  if (!venue) {
    errors.venue = "Venue is required.";
  } else if (
    !/^[\p{L}\d]+(?:[-'@&][\p{L}\d]+)*(?:[ ,][\p{L}\d]+(?:[-'@&][\p{L}\d]+)*)*$/u.test(
      venue
    )
  ) {
    errors.venue = "Invalid venue.";
  }

  if (!details) {
    errors.details = "Details are required.";
  } else if (!validator.isLength(details, { max: 200 })) {
    errors.details = "Details cannot exceed 200 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return json(400, { success: false, errors });
  }

  // --- Mailgun email send, via fetch instead of mailgun.js ---
  try {
    const MAILGUN_API_KEY = env.MAILGUN_API_KEY || env.API_KEY;
    const MAILGUN_DOMAIN = env.MAILGUN_DOMAIN;
    const TO_EMAIL = env.TO_EMAIL;
    const FROM_EMAIL = env.FROM_EMAIL || `postmaster@${MAILGUN_DOMAIN}`;

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN || !TO_EMAIL) {
      return json(500, {
        success: false,
        message: "Email service not configured.",
      });
    }

    const subject = `New ${type} enquiry from ${name}`;
    const textBody = `Name: ${name}
                        Phone: ${number}
                        Email: ${email}
                        Type: ${type}
                        Date: ${date}
                        Venue: ${venue}
                        Details:
                        ${details}`;

    const htmlBody = `
      <h2>New Booking Enquiry</h2>
      <p><strong>Name:</strong> ${validator.escape(name)}</p>
      <p><strong>Phone:</strong> ${validator.escape(number)}</p>
      <p><strong>Email:</strong> ${validator.escape(email)}</p>
      <p><strong>Type:</strong> ${validator.escape(type)}</p>
      <p><strong>Date:</strong> ${validator.escape(date)}</p>
      <p><strong>Venue:</strong> ${validator.escape(venue)}</p>
      <p><strong>Details:</strong><br/>${validator.escape(details)}</p>
    `;

    const auth = "Basic " + btoa(`api:${MAILGUN_API_KEY}`);

    const mailRes = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          from: `Booking Form <${FROM_EMAIL}>`,
          to: TO_EMAIL,
          subject,
          text: textBody,
          html: htmlBody,
        }),
      }
    );

    if (!mailRes.ok) {
      const errText = await mailRes.text().catch(() => "");
      return json(502, {
        success: false,
        message: errText || "Failed to send email.",
      });
    }

    return json(200, {
      success: true,
      message: "Form submitted successfully.",
    });
  } catch (error) {
    const msg =
      error?.message ||
      (typeof error === "string" ? error : null) ||
      "Failed to send email.";
    return json(502, { success: false, message: msg });
  }
}