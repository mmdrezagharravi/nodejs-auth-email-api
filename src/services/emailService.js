const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendWelcomeWithCode = async (userEmail, userName, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "🎉 خوش آمدید! کد تایید شما",
    html: `
            <div style="direction: rtl; font-family: Tahoma; max-width: 500px; margin: 0 auto; padding: 20px;">
                
                <h2 style="color: #333;">سلام ${userName} عزیز! 👋</h2>
                
                <p style="color: #666; font-size: 16px;">
                    به سایت ما خوش آمدید!
                </p>
                
                <p style="color: #666; font-size: 16px;">
                    برای تایید ایمیل، کد زیر را وارد کنید:
                </p>
                
                <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">
                        ${code}
                    </span>
                </div>
                
                <p style="color: #999; font-size: 14px;">
                    ⏰ این کد تا ۱۰ دقیقه معتبر است.
                </p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                
                <p style="color: #999; font-size: 12px;">
                    اگر شما ثبت‌نام نکرده‌اید، این ایمیل را نادیده بگیرید.
                </p>
                
            </div>
        `,
  };

  await transporter.sendMail(mailOptions);
};

exports.resendCode = async (userEmail, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "🔐 کد تایید جدید",
    html: `
            <div style="direction: rtl; font-family: Tahoma; max-width: 500px; margin: 0 auto; padding: 20px;">
                
                <h2 style="color: #333;">کد تایید جدید 🔄</h2>
                
                <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">
                        ${code}
                    </span>
                </div>
                
                <p style="color: #999; font-size: 14px;">
                    ⏰ این کد تا ۱۰ دقیقه معتبر است.
                </p>
                
            </div>
        `,
  };

  await transporter.sendMail(mailOptions);
};
