import type { User, UserRole } from "@/src/types";

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
    },
  },
];

const STORAGE_KEY = "workhub.demo.session";

export interface AuthSession {
  user: User;
  signedInAt: string;
}

function delay(ms = 280): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const authService = {
  getSession(): AuthSession | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getSession() != null;
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
    const session: AuthSession = {
      user: account.user,
      signedInAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  async logout(): Promise<void> {
    await delay(120);
    window.localStorage.removeItem(STORAGE_KEY);
  },

  roleLabel(role: UserRole): string {
    if (role === "admin") return "Administrator / HR";
    if (role === "manager") return "Manager";
    return "Employee";
  },
};
