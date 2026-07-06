import { Router } from 'express';
import { sendEmail } from '../utils/email';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // In a real scenario, this would save to DB and send an email to the admin.
    await sendEmail(
      process.env.ADMIN_EMAIL || 'admin@endrive.com',
      `New Contact Message: ${subject}`,
      `You received a new message from ${name} (${email}):\n\n${message}`,
      `<h3>New Contact Message</h3><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message}</p>`
    );
    
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
