import {
  companies,
  companyEmployeeIds,
  companyUsers,
  toCompanySettings,
} from "@/src/mocks/companies";
import type { Company, CompanySettings, CompanyUser } from "@/src/types";
import { authService } from "./authService";
import { mockRequest } from "./mockClient";

export const companyService = {
  async listAccessible(): Promise<Company[]> {
    const session = authService.getSession();
    const ids = session?.user.companyIds ?? [companies[0].id];
    return mockRequest(companies.filter((c) => ids.includes(c.id)));
  },

  async getActive(): Promise<Company> {
    const session = authService.getSession();
    const id = session?.activeCompanyId ?? companies[0].id;
    const company = companies.find((c) => c.id === id) ?? companies[0];
    return mockRequest(company);
  },

  async getById(id: string): Promise<Company | null> {
    return mockRequest(companies.find((c) => c.id === id) ?? null);
  },

  async switchTo(companyId: string): Promise<Company> {
    await authService.switchCompany(companyId);
    const company = companies.find((c) => c.id === companyId);
    if (!company) throw new Error("Company not found.");
    return mockRequest(company);
  },

  async getSettings(companyId?: string): Promise<CompanySettings> {
    const id =
      companyId ??
      authService.getActiveCompanyId() ??
      companies[0].id;
    const company = companies.find((c) => c.id === id) ?? companies[0];
    return mockRequest(toCompanySettings(company));
  },

  async listUsers(companyId?: string): Promise<CompanyUser[]> {
    const id =
      companyId ??
      authService.getActiveCompanyId() ??
      companies[0].id;
    return mockRequest(
      companyUsers
        .filter((u) => u.companyId === id)
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
  },

  getEmployeeIdsForActiveCompany(): string[] {
    const id = authService.getActiveCompanyId() ?? companies[0].id;
    return companyEmployeeIds[id] ?? companyEmployeeIds[companies[0].id];
  },
};
