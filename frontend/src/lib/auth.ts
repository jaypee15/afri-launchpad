import nodemailer from "nodemailer";

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export async function sendVerificationEmail(email: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome to Africa Launchpad - Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333;">Welcome to Africa Launchpad</h1>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin-bottom: 20px; color: #555; line-height: 1.5;">
            Thank you for joining Africa Launchpad! We're excited to have you on board. To get started, please verify your email address by entering the following verification code:
          </p>
          
          <div style="background-color: #fff; padding: 15px; border-radius: 4px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${otp}</span>
          </div>
          
          <p style="color: #777; font-size: 14px;">
            This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; color: #888; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Africa Launchpad. All rights reserved.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset Your Africa Launchpad Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333;">Password Reset Request</h1>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin-bottom: 20px; color: #555; line-height: 1.5;">
            We received a request to reset your Africa Launchpad password. To proceed with the password reset, please use the following verification code:
          </p>
          
          <div style="background-color: #fff; padding: 15px; border-radius: 4px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${otp}</span>
          </div>
          
          <p style="color: #777; font-size: 14px;">
            This code will expire in 10 minutes. If you didn't request this password reset, please ignore this email or contact support if you have concerns.
          </p>
        </div>
        
        <div style="text-align: center; color: #888; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Africa Launchpad. All rights reserved.</p>
          <p>For security reasons, never share this code with anyone.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
} 