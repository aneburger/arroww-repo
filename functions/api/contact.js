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
    if (!secret) {
      return json(500, {
        success: false,
        message: "Captcha not configured on server (missing RECAPTCHA_SECRET).",
      });
    }

    const parsedMinScore = parseFloat(env.RECAPTCHA_MIN_SCORE);
    const minScore = Number.isFinite(parsedMinScore) ? parsedMinScore : 0.5;

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
      const errorCodes = Array.isArray(verifyData["error-codes"])
        ? verifyData["error-codes"].join(", ")
        : "";

      return json(403, {
        success: false,
        message: "Captcha verification failed.",
        ...(errorCodes ? { captchaErrorCodes: errorCodes } : {}),
      });
    }

    if (verifyData.action && action && verifyData.action !== action) {
      return json(403, {
        success: false,
        message: "Captcha action mismatch.",
        captchaExpectedAction: action,
        captchaActualAction: verifyData.action,
      });
    }

    if (typeof verifyData.score === "number" && verifyData.score < minScore) {
      return json(403, {
        success: false,
        message: "Captcha score too low.",
        captchaScore: verifyData.score,
        captchaMinScore: minScore,
      });
    }
  } catch (e) {
    return json(502, {
      success: false,
      message: "Captcha verification error.",
    });
  }

  
  const errors = {};
  const budgetOptions = [
    "R5,000 - R10,000",
    "R10,000 - R20,000",
    "R20,000+",
    "Not sure yet",
  ];

  let { name, email, brief, budget } = body;

  name = sanitizeInput(name);
  email = sanitizeInput(email);
  brief = sanitizeInput(brief);
  budget = sanitizeInput(budget);

  if (name && name.length > 100) errors.name = "Full name cannot exceed 100 characters.";
  if (email && email.length > 50) errors.email = "Email cannot exceed 50 characters.";
  if (brief && brief.length > 500) errors.brief = "Brief cannot exceed 500 characters.";
  if (budget && budget.length > 50) errors.budget = "Budget cannot exceed 50 characters.";

  if (!name) {
    errors.name = "Full name is required.";
  } else {
    const fullName = name.replace(/\s+/g, " ").trim();
    if (!/^[\p{L}]+(?:[-'][\p{L}]+)*(?: [\p{L}]+(?:[-'][\p{L}]+)*)*$/u.test(fullName)) {
      errors.name = "Invalid full name.";
    }
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!validator.isEmail(email)) {
    errors.email = "Invalid email format.";
  }

  if (!brief) {
    errors.brief = "Brief is required.";
  }

  if (!budget) {
    errors.budget = "Budget is required.";
  } else if (!budgetOptions.includes(budget)) {
    errors.budget = "Invalid budget option.";
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

    const subject = `New enquiry from ${name}`;
    const textBody = `Name: ${name}
  Email: ${email}
  Budget: ${budget}
  Brief:
  ${brief}`;

    const htmlBody = `
      <h2>New Enquiry</h2>
      <p><strong>Name:</strong> ${validator.escape(name)}</p>
      <p><strong>Email:</strong> ${validator.escape(email)}</p>
      <p><strong>Budget:</strong> ${validator.escape(budget)}</p>
      <p><strong>Brief:</strong><br/>${validator.escape(brief)}</p>
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