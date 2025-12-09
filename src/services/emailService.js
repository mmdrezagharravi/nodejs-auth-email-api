const nodemailer = require("nodemailer");

const transporter = nodemailer.createTestAccount({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendWelcomeEmail = async (userEmail, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "WELCOME ;)",
    html: `
              <div style="direction: rtl; font-family: Tahoma;">
                <h2>سلام ${userName} عزیز!</h2>
                <p>به سایت ما خوش آمدید.</p>
                <p>ثبت نام شما با موفقیت انجام شد.</p>
            </div>`,
  };
  await transporter.sendMail(mailOptions);
};

exports.sendVerificationEmail = async (userEmail, token) => {
  const verifyUrl = `http://localhost:3000/api/auth/verify/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "✉️ تایید ایمیل",
    html: `
            <div style="direction: rtl; font-family: Tahoma;">
                <h2>تایید ایمیل</h2>
                <p>برای تایید ایمیل خود روی لینک زیر کلیک کنید:</p>
                <a href="${verifyUrl}">تایید ایمیل</a>
            </div>
        `,
  };
  await transporter.sendMail(mailOptions);
};
