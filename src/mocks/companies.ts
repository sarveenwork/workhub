import type { Company, CompanySettings, CompanyUser } from "@/src/types";

export const companies: Company[] = [
  {
    id: "co-ampang",
    name: "Workhub Demo Sdn Bhd",
    code: "WH-AMP",
    registrationNumber: "202401234567 (DEMO)",
    address: "Level 12, Menara Demo, Jalan Ampang, 50450 Kuala Lumpur",
    phone: "+60 3-2123 4567",
    email: "hr@workhub.demo",
    currency: "MYR",
    timezone: "Asia/Kuala_Lumpur",
    status: "active",
    employeeCount: 32,
  },
  {
    id: "co-penang",
    name: "Northern Guard Services Sdn Bhd",
    code: "NGS-PG",
    registrationNumber: "202109876543 (DEMO)",
    address: "12, Jalan Sultan Ahmad Shah, 10050 George Town, Penang",
    phone: "+60 4-229 1100",
    email: "hr@northernguard.demo",
    currency: "MYR",
    timezone: "Asia/Kuala_Lumpur",
    status: "active",
    employeeCount: 14,
  },
  {
    id: "co-jb",
    name: "Southlink Facilities Sdn Bhd",
    code: "SLF-JB",
    registrationNumber: "201812345678 (DEMO)",
    address: "No. 8, Jalan Austin Heights, 81100 Johor Bahru",
    phone: "+60 7-351 2200",
    email: "ops@southlink.demo",
    currency: "MYR",
    timezone: "Asia/Kuala_Lumpur",
    status: "active",
    employeeCount: 9,
  },
];

/** Which employee IDs belong to which company (demo partitioning). */
export const companyEmployeeIds: Record<string, string[]> = {
  "co-ampang": Array.from({ length: 32 }, (_, i) => `emp-${String(i + 1).padStart(3, "0")}`),
  "co-penang": [
    "emp-001",
    "emp-002",
    "emp-008",
    "emp-010",
    "emp-012",
    "emp-015",
    "emp-019",
    "emp-022",
    "emp-024",
    "emp-025",
    "emp-027",
    "emp-028",
    "emp-029",
    "emp-031",
  ],
  "co-jb": [
    "emp-003",
    "emp-005",
    "emp-007",
    "emp-009",
    "emp-011",
    "emp-014",
    "emp-017",
    "emp-020",
    "emp-032",
  ],
};

export const companyUsers: CompanyUser[] = [
  // Ampang
  {
    id: "cu-1",
    companyId: "co-ampang",
    name: "Deepa Krishnan",
    email: "admin@workhub.demo",
    role: "admin",
    status: "active",
    lastActiveAt: "2026-09-22T22:00:00+08:00",
  },
  {
    id: "cu-2",
    companyId: "co-ampang",
    name: "Muhammad Hafiz",
    email: "manager@workhub.demo",
    role: "manager",
    status: "active",
    lastActiveAt: "2026-09-22T18:40:00+08:00",
  },
  {
    id: "cu-3",
    companyId: "co-ampang",
    name: "Nurul Aisyah",
    email: "nurul.aisyah@workhub.demo",
    role: "manager",
    status: "active",
    lastActiveAt: "2026-09-21T16:00:00+08:00",
  },
  {
    id: "cu-4",
    companyId: "co-ampang",
    name: "Ahmad Faizal",
    email: "guard@workhub.demo",
    role: "employee",
    status: "active",
    lastActiveAt: "2026-09-22T08:00:00+08:00",
  },
  // Penang
  {
    id: "cu-5",
    companyId: "co-penang",
    name: "Deepa Krishnan",
    email: "admin@workhub.demo",
    role: "admin",
    status: "active",
    lastActiveAt: "2026-09-20T11:00:00+08:00",
  },
  {
    id: "cu-6",
    companyId: "co-penang",
    name: "Tan Mei Ling",
    email: "meiling.tan@northernguard.demo",
    role: "manager",
    status: "active",
    lastActiveAt: "2026-09-22T09:15:00+08:00",
  },
  {
    id: "cu-7",
    companyId: "co-penang",
    name: "Rajesh Murugan",
    email: "rajesh@northernguard.demo",
    role: "employee",
    status: "invited",
    lastActiveAt: null,
  },
  // JB
  {
    id: "cu-8",
    companyId: "co-jb",
    name: "Deepa Krishnan",
    email: "admin@workhub.demo",
    role: "admin",
    status: "active",
    lastActiveAt: "2026-09-18T10:00:00+08:00",
  },
  {
    id: "cu-9",
    companyId: "co-jb",
    name: "Chong Wei Ming",
    email: "weiming@southlink.demo",
    role: "admin",
    status: "active",
    lastActiveAt: "2026-09-22T14:20:00+08:00",
  },
  {
    id: "cu-10",
    companyId: "co-jb",
    name: "Siti Nurhaliza",
    email: "siti@southlink.demo",
    role: "manager",
    status: "disabled",
    lastActiveAt: "2026-08-01T09:00:00+08:00",
  },
];

export function toCompanySettings(company: Company): CompanySettings {
  return {
    id: company.id,
    name: company.name,
    registrationNumber: company.registrationNumber,
    address: company.address,
    phone: company.phone,
    email: company.email,
    currency: company.currency,
    timezone: company.timezone,
  };
}

/** @deprecated use companies[0] via companyService — kept for backward-compatible imports */
export const companySettings: CompanySettings = toCompanySettings(companies[0]);
