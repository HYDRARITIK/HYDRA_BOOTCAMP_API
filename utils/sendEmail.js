var nodemailer = require("nodemailer");

module.exports.sendmail = async function (options) {
  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });//

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: "Password reset token",
    text: `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${options.resetUrl}`,
  };

  const info = await transport.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};
