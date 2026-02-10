/*****************************************
 * Created On: 2025 / 11 / 28
 * Last Modified: 2025 / 02 / 10
 * 
 * Author: Ané Burger t.a. Arroww Web Dev
 * 
******************************************/

import express from 'express';
import path from 'path';
import validator from 'validator';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import dotenv from 'dotenv';
import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
import { URLSearchParams } from 'url';

import FormData from "form-data"; 
import Mailgun from "mailgun.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json({ limit: '10kb' }));

app.use(helmet({ contentSecurityPolicy: false }));

// const contactLimiter = rateLimit({
//   windowMs: 60 * 1000,
//   max: 10,
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// app.use(express.static("frontend/public"));
app.use(express.static(path.resolve('frontend', 'public')));

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);



function sanitizeInput(input) {
  const safe = typeof input === 'string' ? input : '';
  return DOMPurify.sanitize(safe, {
    USE_PROFILES: { html: false },
  }).trim();
}

function onlyDigits(str) {
    return (str || '').replace(/\D+/g, '');
}

app.post("/contact", async (req, res) => {
	try {
		const token = sanitizeInput(req.body.captchaToken);
		const action = sanitizeInput(req.body.captchaAction);
		if (!token) return res.status(400).json({ success: false, message: "Captcha required." });

		const secret = process.env.RECAPTCHA_SECRET;
		const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE);

		const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			secret,
			response: token,
			remoteip: req.ip
		})
		});

		const verifyData = await verifyRes.json();
		if (!verifyData.success) {
			return res.status(429).json({ success: false, message: "Captcha verification failed." });
		}
		
		if (verifyData.action && action && verifyData.action !== action) {
			return res.status(429).json({ success: false, message: "Captcha action mismatch." });
		}
		if (typeof verifyData.score === 'number' && verifyData.score < minScore) {
			return res.status(429).json({ success: false, message: "Captcha score too low." });
		}
	} catch (e) {
		return res.status(429).json({ success: false, message: "Captcha verification error." });
	}


    const errors = {};
    const budgetOptions = [
        "Under R5,000",
        "R5,000 – R10,000",
        "R10,000 – R20,000",
        "R20,000+",
        "Not sure yet",
    ];
    let {name, email, brief, budget} = req.body;

    name = sanitizeInput(name);
    email = sanitizeInput(email);
    brief = sanitizeInput(brief);
    budget = sanitizeInput(budget);

    if (name && name.length > 100) errors.name = "Full name cannot exceed 100 characters.";
    if (email && email.length > 50) errors.email = "Email cannot exceed 50 characters.";
    if (brief && brief.length > 500) errors.brief = "Brief cannot exceed 500 characters.";
    if (budget && budget.length > 50) errors.budget = "Budget cannot exceed 50 characters.";

    if(!name) {
        errors.name = "Full name is required.";
    } else {
        const fullName = name.replace(/\s+/g, ' ').trim();
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
        return res.status(400).json({ success: false, errors });
    }



	try {
        const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY || process.env.API_KEY;
        const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN; 
        const TO_EMAIL = process.env.TO_EMAIL;            
        const FROM_EMAIL = process.env.FROM_EMAIL || `postmaster@${MAILGUN_DOMAIN}`;

        if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN || !TO_EMAIL) {
            return res.status(500).json({ success: false, message: "Email service not configured." });
        }
		
		const mailgun = new Mailgun(FormData);
        const mg = mailgun.client({ username: "api", key: MAILGUN_API_KEY });

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

        const data = await mg.messages.create(MAILGUN_DOMAIN, {
            from: `Booking Form <${FROM_EMAIL}>`,
            to: [TO_EMAIL],
            subject,
            text: textBody,
            html: htmlBody
        });
		
        return res.status(200).json({ success: true, message: "Form submitted successfully." });
    } catch (error) {
        console.error("Mailgun error:", error);
        
        const msg =
            error?.message ||
            error?.response?.body?.message ||
            "Failed to send email.";
        return res.status(502).json({ success: false, message: msg });
    }

});


app.get('/{*any}', (req, res) => res.sendFile(path.resolve('frontend', 'public', 'index.html')));	

app.listen(port, () => {
   	console.log(`Listening on http://localhost:${port}`);
});
