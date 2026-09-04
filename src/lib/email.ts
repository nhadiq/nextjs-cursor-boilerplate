import { Resend } from 'resend';
import { env } from '@/env';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const fromAddress = env.EMAIL_FROM ?? 'onboarding@resend.dev';

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    if (env.NODE_ENV === 'development') {
      console.info(`[email:dev] To: ${to} | Subject: ${subject}`);
      return;
    }
    throw new Error('Email provider is not configured');
  }

  await resend.emails.send({
    from: fromAddress,
    to,
    subject,
    html,
  });
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
  name,
}: {
  to: string;
  resetUrl: string;
  name: string;
}) {
  await sendEmail({
    to,
    subject: 'Reset your password',
    html: `<p>Hi ${name},</p><p><a href="${resetUrl}">Reset your password</a></p>`,
  });
}

export async function sendVerificationEmail({
  to,
  verifyUrl,
  name,
}: {
  to: string;
  verifyUrl: string;
  name: string;
}) {
  await sendEmail({
    to,
    subject: 'Verify your email',
    html: `<p>Hi ${name},</p><p><a href="${verifyUrl}">Verify your email</a></p>`,
  });
}
