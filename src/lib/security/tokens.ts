import crypto from "node:crypto";

export function createInviteToken(params: { campaignId: string; assignmentId: string; email: string; ttlHours?: number }) {
  const ttl = Math.min(Math.max(params.ttlHours ?? 120, 1), 24 * 14); // 1h..14d, default 120h
  const expiresAt = new Date(Date.now() + ttl * 60 * 60 * 1000);
  const random = crypto.randomBytes(24).toString("base64url");
  const token = `${random}.${crypto.createHash("sha256").update(params.campaignId + params.assignmentId + params.email).digest("base64url")}`;
  return { token, expiresAt };
}


