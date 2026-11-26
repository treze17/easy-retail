const nodemailer = require('nodemailer')

// Development version: uses Ethereal (a fake inbox). Nothing is delivered to a real address.
// For production, swap this transporter for a real provider and put its credentials in .env.
module.exports = async (to, subject, text) => {
  // creates a temporary fake account each time (no signup needed)
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"easy-retail" <no-reply@yourapp.com>',
    to,
    subject,
    text,
  });

  // open this link in your browser to read the email and get the OTP
  console.log('Preview email:', nodemailer.getTestMessageUrl(info));
};
