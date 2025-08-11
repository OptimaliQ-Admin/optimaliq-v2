import { resend } from "@/lib/resend";

export async function sendAssessmentInviteEmail(params: {
  to: string;
  name?: string | null;
  title: string;
  token: string;
}) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL || "https://optimaliq.ai"}/delegate/a/${params.token}`;
  const subject = `You've been asked to complete an OptimaliQ assessment`;
  const html = `<div style="font-family:Inter,system-ui,Arial,sans-serif;line-height:1.6">
    <h2 style="margin:0 0 12px">${params.title}</h2>
    <p>${params.name ? `Hi ${params.name},` : "Hello,"}</p>
    <p>You've been invited to securely complete a short assessment. No login required. This link will expire.</p>
    <p><a href="${url}" style="background:#1d4ed8;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Start Assessment</a></p>
    <p style="color:#64748b;font-size:12px">If the button doesn't work, copy and paste this URL: ${url}</p>
  </div>`;
  if (resend) {
    await resend.emails.send({ to: params.to, subject, html, from: process.env.NEXT_PUBLIC_EMAIL_FROM || "noreply@optimaliq.ai" });
  }
}


