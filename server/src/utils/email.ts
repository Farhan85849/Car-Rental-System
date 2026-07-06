import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  auth: {
    user: process.env.EMAIL_USER || 'ethereal_user',
    pass: process.env.EMAIL_PASS || 'ethereal_pass'
  }
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"Endrive Rentals" <noreply@endrive.com>',
      to,
      subject,
      text,
      html: html || text
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // Do not throw to prevent blocking the main flow if email fails
    return false;
  }
};
