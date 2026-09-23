import type { Department, Position } from "@/src/types";

export const departments: Department[] = [
  { id: "dept-ops", name: "Operations", code: "OPS", employeeCount: 12 },
  { id: "dept-sec", name: "Security", code: "SEC", employeeCount: 8 },
  { id: "dept-admin", name: "Administration", code: "ADM", employeeCount: 5 },
  { id: "dept-hr", name: "Human Resources", code: "HR", employeeCount: 3 },
  { id: "dept-fin", name: "Finance", code: "FIN", employeeCount: 2 },
];

export const positions: Position[] = [
  { id: "pos-sg", title: "Security Guard", departmentId: "dept-sec", code: "SG" },
  { id: "pos-ss", title: "Security Supervisor", departmentId: "dept-sec", code: "SS" },
  { id: "pos-po", title: "Patrol Officer", departmentId: "dept-ops", code: "PO" },
  { id: "pos-ppo", title: "Senior Patrol Officer", departmentId: "dept-ops", code: "PPO" },
  { id: "pos-rg", title: "Reception Guard", departmentId: "dept-ops", code: "RG" },
  { id: "pos-ops", title: "Operations Executive", departmentId: "dept-ops", code: "OE" },
  { id: "pos-adm", title: "Admin Assistant", departmentId: "dept-admin", code: "AA" },
  { id: "pos-hr", title: "HR Executive", departmentId: "dept-hr", code: "HRE" },
  { id: "pos-hrm", title: "HR Manager", departmentId: "dept-hr", code: "HRM" },
  { id: "pos-acc", title: "Accounts Executive", departmentId: "dept-fin", code: "ACE" },
  { id: "pos-fin", title: "Finance Manager", departmentId: "dept-fin", code: "FM" },
  { id: "pos-om", title: "Operations Manager", departmentId: "dept-ops", code: "OM" },
];
