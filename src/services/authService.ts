import type { User, UserRole } from "@/src/types";
import { companies } from "@/src/mocks/companies";

export interface DemoAccount {
  email: string;
  password: string;
  user: User;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: "admin@workhub.demo",
    password: "demo123",
    user: {
      id: "user-admin",
      name: "Deepa Krishnan",
      email: "admin@workhub.demo",
      role: "admin",
      avatarUrl: null,
      companyIds: ["co-ampang", "co-penang", "co-jb"],
    },
  },
  {
    email: "manager@workhub.demo",
    password: "demo123",
    user: {
      id: "user-manager",
      name: "Muhammad Hafiz",
      email: "manager@workhub.demo",
      role: "manager",
      avatarUrl: null,
      companyIds: ["co-ampang", "co-penang"],
    },
  },
  {
    email: "guard@workhub.demo",
    password: "demo123",
    user: {
      id: "user-guard",
      name: "Ahmad Faizal",
      email: "guard@workhub.demo",
      role: "employee",
      avatarUrl: null,
      companyIds: ["co-ampang"],
    },
  },
];

const SESSION_KEY = "workhub.demo.session";
const COMPANY_KEY = "workhub.demo.activeCompanyId";

export interface AuthSession {
  user: User;
  signedInAt: string;
  activeCompanyId: string;
}

function delay(ms = 280): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resolveCompanyId(user: User, preferred?: string | null): string {
  if (preferred && user.companyIds.includes(preferred)) return preferred;
  return user.companyIds[0] ?? companies[0].id;
}

export const authService = {
  getSession(): AuthSession | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AuthSession & { activeCompanyId?: string };
      // Backfill older sessions that lacked companyIds / activeCompanyId
      const account = DEMO_ACCOUNTS.find((a) => a.user.id === parsed.user.id);
      const user: User = {
        ...parsed.user,
        companyIds: parsed.user.companyIds?.length
          ? parsed.user.companyIds
          : (account?.user.companyIds ?? ["co-ampang"]),
      };
      const storedCompany = window.localStorage.getItem(COMPANY_KEY);
      const activeCompanyId = resolveCompanyId(
        user,
        parsed.activeCompanyId ?? storedCompany,
      );
      return { ...parsed, user, activeCompanyId };
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getSession() != null;
  },

  getActiveCompanyId(): string | null {
    return this.getSession()?.activeCompanyId ?? null;
  },

  async login(email: string, password: string): Promise<AuthSession> {
    await delay();
    const account = DEMO_ACCOUNTS.find(
      (a) =>
        a.email.toLowerCase() === email.trim().toLowerCase() &&
        a.password === password,
    );
    if (!account) {
      throw new Error("Invalid email or password.");
    }
    const storedCompany = window.localStorage.getItem(COMPANY_KEY);
    const activeCompanyId = resolveCompanyId(account.user, storedCompany);
    const session: AuthSession = {
      user: account.user,
      signedInAt: new Date().toISOString(),
      activeCompanyId,
    };
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.localStorage.setItem(COMPANY_KEY, activeCompanyId);
    return session;
  },

  async switchCompany(companyId: string): Promise<AuthSession> {
    await delay(120);
    const session = this.getSession();
    if (!session) throw new Error("Not signed in.");
    if (!session.user.companyIds.includes(companyId)) {
      throw new Error("You do not have access to this company.");
    }
    const next: AuthSession = { ...session, activeCompanyId: companyId };
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    window.localStorage.setItem(COMPANY_KEY, companyId);
    return next;
  },

  async logout(): Promise<void> {
    await delay(120);
    window.localStorage.removeItem(SESSION_KEY);
    // Keep last company preference for next login convenience
  },

  roleLabel(role: UserRole): string {
    if (role === "admin") return "Administrator / HR";
    if (role === "manager") return "Manager";
    return "Employee";
  },
};
