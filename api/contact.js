export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, recaptchaToken } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (!recaptchaToken) {
    return res.status(400).json({ error: "reCAPTCHA token required" });
  }

  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  if (!recaptchaSecret) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const verifyRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${encodeURIComponent(recaptchaSecret)}&response=${encodeURIComponent(recaptchaToken)}`,
      },
    );
    const verifyData = await verifyRes.json();

    if (!verifyData.success || (verifyData.score !== undefined && verifyData.score < 0.5)) {
      return res.status(403).json({ error: "reCAPTCHA verification failed" });
    }
  } catch {
    return res.status(500).json({ error: "reCAPTCHA verification error" });
  }

  const emailjsServiceId = process.env.EMAILJS_SERVICE_ID;
  const emailjsTemplateEnterprise = process.env.EMAILJS_TEMPLATE_ENTERPRISE;
  const emailjsTemplateClient = process.env.EMAILJS_TEMPLATE_CLIENT;
  const emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (!emailjsServiceId || !emailjsTemplateEnterprise || !emailjsPublicKey) {
    return res.status(500).json({ error: "Email configuration error" });
  }

  let enterpriseOk = false;

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: emailjsServiceId,
        template_id: emailjsTemplateEnterprise,
        user_id: emailjsPublicKey,
        template_params: { email, reply_to: email },
      }),
    });
    if (response.ok) enterpriseOk = true;
  } catch {
    // Enterprise email failed
  }

  if (emailjsTemplateClient) {
    try {
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: emailjsServiceId,
          template_id: emailjsTemplateClient,
          user_id: emailjsPublicKey,
          template_params: { email, reply_to: email },
        }),
      });
    } catch {
      // Client email failed
    }
  }

  if (enterpriseOk) {
    return res.status(200).json({ success: true });
  }
  return res.status(500).json({ error: "Failed to send email" });
}
