export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, recaptchaToken } = req.body || {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (!recaptchaToken) {
      return res.status(400).json({ error: "reCAPTCHA token required" });
    }

    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      return res.status(500).json({ error: "RECAPTCHA_SECRET_KEY not configured" });
    }

    const verifyRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: recaptchaSecret,
          response: recaptchaToken,
        }).toString(),
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return res.status(403).json({ error: "reCAPTCHA failed", codes: verifyData["error-codes"] });
    }

    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateClient = process.env.EMAILJS_TEMPLATE_CLIENT;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateClient || !privateKey) {
      return res.status(500).json({ error: "EmailJS env vars not configured" });
    }

    const params = { email, reply_to: email };

    const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateClient,
        private_key: privateKey,
        template_params: params,
      }),
    });

    const emailBody = await emailRes.text();

    if (!emailRes.ok) {
      return res.status(500).json({ error: "EmailJS failed", status: emailRes.status, body: emailBody });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
}
