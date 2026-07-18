// Shared types - Prisma types are regenerated when running `npm run db:generate`
// In this sandbox build, we use simplified types so TypeScript compiles without the generated client.

export type Lang = "en" | "est" | "lat";

export type AIFeature = "CHAT" | "ADVISOR" | "ANALYZER" | "HEALTH" | "LIFE_EVENT" | "DOC_READER" | "TAX" | "HEILI" | "ANDRES" | "BRANCH";

// These are placeholders — replaced at runtime by Prisma's generated types
// Run `npm run db:generate` after setup to enable full type inference.
export type DashboardData = {
  member: any;
  accounts: any[];
  policies: any[];
  transactions: any[];
  notifications: any[];
  threads: any[];
  creditScore: any;
  upcomingAppointment: any;
  coverageScore: number;
  coverageBreakdown: Array<{ type: string; covered: boolean }>;
  unreadNotifications: number;
};

export type ThreadWithMessages = any;
