import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[Mock Email] To: ${to}, Subject: ${subject}`);
      return true;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: '"Endrive Rentals" <noreply@endrive.com>',
      to,
      subject,
      text,
      html: html || text
    });
    
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return true;
  } catch (error: any) {
    // Log as a warning rather than an error so it doesn't get flagged as an app crash
    console.warn(`[Email Warning] Could not send email: ${error.message}`);
    // Do not throw to prevent blocking the main flow if email fails
    return false;
  }
};
