module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, recaptchaToken } = req.body || {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (!recaptchaToken) {
      return res.status(400).json({ error: "reCAPTCHA token required" });
    }

    var recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      return res.status(500).json({ error: "RECAPTCHA_SECRET_KEY not configured" });
    }

    var verifyRes;
    try {
      verifyRes = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: "secret=" + encodeURIComponent(recaptchaSecret) + "&response=" + encodeURIComponent(recaptchaToken),
        },
      );
    } catch (fetchErr) {
      return res.status(500).json({ error: "Failed to reach reCAPTCHA: " + fetchErr.message });
    }

    var verifyData;
    try {
      verifyData = await verifyRes.json();
    } catch (parseErr) {
      return res.status(500).json({ error: "Invalid reCAPTCHA response" });
    }

    if (!verifyData.success) {
      return res.status(403).json({ error: "reCAPTCHA verification failed", details: verifyData["error-codes"] });
    }

    var emailjsServiceId = process.env.EMAILJS_SERVICE_ID;
    var emailjsTemplateEnterprise = process.env.EMAILJS_TEMPLATE_ENTERPRISE;
    var emailjsTemplateClient = process.env.EMAILJS_TEMPLATE_CLIENT;
    var emailjsPublicKey = process.env.EMAILJS_PUBLIC_KEY;

    if (!emailjsServiceId || !emailjsTemplateEnterprise || !emailjsPublicKey) {
      return res.status(500).json({ error: "Email env vars not configured" });
    }

    var templateParams = { email: email, reply_to: email };
    var enterpriseOk = false;

    try {
      var response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: emailjsServiceId,
          template_id: emailjsTemplateEnterprise,
          user_id: emailjsPublicKey,
          template_params: templateParams,
        }),
      });
      if (response.ok) {
        enterpriseOk = true;
      } else {
        var errBody = await response.text();
        return res.status(500).json({ error: "EmailJS enterprise failed", status: response.status, body: errBody });
      }
    } catch (emailErr) {
      return res.status(500).json({ error: "EmailJS enterprise error: " + emailErr.message });
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
            template_params: templateParams,
          }),
        });
      } catch (_err) {
        // Client confirmation email is optional
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Unexpected error: " + err.message });
  }
};
