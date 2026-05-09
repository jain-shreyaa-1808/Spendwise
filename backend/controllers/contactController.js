import nodemailer from "nodemailer";

export const sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email address." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
console.log("mail:", process.env.EMAIL_USER);
  
    await transporter.sendMail({
      from: `"SpendWise Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New message from ${name} via SpendWise`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">SpendWise</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">New Contact Form Message</p>
          </div>
          <div style="background: white; padding: 28px; border-radius: 10px; border: 1px solid #e2e8f0;">
            <p style="font-size: 14px; color: #64748b; margin: 0 0 20px;">You received a new message from your SpendWise contact form:</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px; background: #f8fafc; border-radius: 6px; font-weight: 600; color: #7c3aed; width: 100px;">Name</td>
                <td style="padding: 12px; color: #1e293b;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: 600; color: #7c3aed;">Email</td>
                <td style="padding: 12px; color: #1e293b;"><a href="mailto:${email}" style="color: #4f46e5;">${email}</a></td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #7c3aed;">
              <p style="font-weight: 600; color: #7c3aed; margin: 0 0 8px;">Message</p>
              <p style="color: #374151; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">Reply directly to this email to respond to ${name}</p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, message: "Failed to send message. Please try again." });
  }
};
