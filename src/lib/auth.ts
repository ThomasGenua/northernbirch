// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import { cookies } from "next/headers";
// import { prisma } from "./db";

// const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
// const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "nbcu_session";
// const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days

// export type SessionPayload = {
//   memberId: string;
//   email: string;
// };

// export async function hashPassword(password: string): Promise<string> {
//   return bcrypt.hash(password, 10);
// }

// export async function verifyPassword(password: string, hash: string): Promise<boolean> {
//   return bcrypt.compare(password, hash);
// }

// export function createToken(payload: SessionPayload): string {
//   return jwt.sign(payload, JWT_SECRET, { expiresIn: SESSION_DURATION });
// }

// export function verifyToken(token: string): SessionPayload | null {
//   try {
//     return jwt.verify(token, JWT_SECRET) as SessionPayload;
//   } catch {
//     return null;
//   }
// }

// export async function getSession(): Promise<SessionPayload | null> {
//   const cookieStore = await cookies();
//   const token = cookieStore.get(COOKIE_NAME)?.value;
//   if (!token) return null;
//   return verifyToken(token);
// }

// export async function getCurrentMember() {
//   const session = await getSession();
//   if (!session) return null;
//   return prisma.member.findUnique({
//     where: { id: session.memberId },
//     include: { branch: true },
//   });
// }

// export async function setSessionCookie(token: string) {
//   const cookieStore = await cookies();
//   cookieStore.set(COOKIE_NAME, token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     maxAge: SESSION_DURATION,
//     path: "/",
//   });
// }

// export async function clearSession() {
//   const cookieStore = await cookies();
//   cookieStore.delete(COOKIE_NAME);
// }

// export async function login(email: string, password: string): Promise<{ ok: true; member: SessionPayload } | { ok: false; error: string }> {
//   const member = await prisma.member.findUnique({ where: { email } });
//   if (!member) return { ok: false, error: "Invalid credentials" };
//   const valid = await verifyPassword(password, member.passwordHash);
//   if (!valid) return { ok: false, error: "Invalid credentials" };
//   await prisma.member.update({ where: { id: member.id }, data: { lastLogin: new Date() } });
//   const payload = { memberId: member.id, email: member.email };
//   const token = createToken(payload);
//   await setSessionCookie(token);
//   return { ok: true, member: payload };
// }


import { cookies } from "next/headers";

export type SessionPayload = {
  memberId: string;
  email: string;
};

// Return a persistent structural mock profile without checking database tables
export async function getSession(): Promise<SessionPayload | null> {
  return { memberId: "demo-member-101", email: "maria.tamm@example.com" };
}

export async function getCurrentMember() {
  return {
    id: "demo-member-101",
    memberNumber: "NB-2026-9842",
    firstName: "Maria",
    lastName: "Tamm",
    email: "maria.tamm@example.com",
    identityVerified: true,
    kycStatus: "APPROVED",
    lastLogin: new Date(),
    memberSince: new Date("2018-04-12"),
    branch: { id: "b1", name: "Tartu College Branch", city: "Toronto" }
  };
}

export async function clearSession() { return true; }
export async function setSessionCookie(token: string) { return true; }

export async function login(email: string, password: string) {
  return { ok: true as const, member: { memberId: "demo-member-101", email } };
}