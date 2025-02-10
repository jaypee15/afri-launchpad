import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";
import nodemailer from "nodemailer";

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection("users").findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email first");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID!,
      clientSecret: process.env.TWITTER_SECRET!,
      version: "2.0",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID!,
      clientSecret: process.env.FACEBOOK_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
};

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