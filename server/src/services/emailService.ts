export const EmailService = {
  sendEmail: async (to: string, subject: string, html: string) => {
    console.log(`Sending email to ${to}: ${subject}`);
    return true;
  }
};
