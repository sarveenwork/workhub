import { departments, employees, positions } from "@/src/mocks";
import type {
  Department,
  Employee,
  EmployeeFilters,
  PaginatedResult,
  Position,
} from "@/src/types";
import { companyService } from "./companyService";
import { mockRequest, paginate } from "./mockClient";

export const employeeService = {
  async list(filters: EmployeeFilters = {}): Promise<PaginatedResult<Employee>> {
    const allowed = new Set(companyService.getEmployeeIdsForActiveCompany());
    let result = employees.filter((e) => allowed.has(e.id));

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.employeeId.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q),
      );
    }

    if (filters.employmentType && filters.employmentType !== "all") {
      result = result.filter((e) => e.employmentType === filters.employmentType);
    }

    if (filters.status && filters.status !== "all") {
      result = result.filter((e) => e.status === filters.status);
    }

    if (filters.departmentId && filters.departmentId !== "all") {
      result = result.filter((e) => e.departmentId === filters.departmentId);
    }

    const sortBy = filters.sortBy ?? "name";
    const sortDir = filters.sortDir ?? "asc";
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = a.fullName.localeCompare(b.fullName);
      if (sortBy === "joinDate") cmp = a.joinDate.localeCompare(b.joinDate);
      if (sortBy === "salary") cmp = a.basicSalary - b.basicSalary;
      if (sortBy === "employeeId") cmp = a.employeeId.localeCompare(b.employeeId);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return mockRequest(paginate(result, filters.page ?? 1, filters.pageSize ?? 10));
  },

  async getById(id: string): Promise<Employee | null> {
    const allowed = new Set(companyService.getEmployeeIdsForActiveCompany());
    if (!allowed.has(id)) return mockRequest(null);
    return mockRequest(employees.find((e) => e.id === id) ?? null);
  },

  async getDepartments(): Promise<Department[]> {
    return mockRequest(departments);
  },

  async getPositions(): Promise<Position[]> {
    return mockRequest(positions);
  },

  async create(input: Omit<Employee, "id">): Promise<Employee> {
    const employee: Employee = { ...input, id: `emp-${Date.now()}` };
    employees.push(employee);
    return mockRequest(employee);
  },

  async update(id: string, patch: Partial<Employee>): Promise<Employee | null> {
    const idx = employees.findIndex((e) => e.id === id);
    if (idx < 0) return mockRequest(null);
    employees[idx] = { ...employees[idx], ...patch };
    return mockRequest(employees[idx]);
  },
};
