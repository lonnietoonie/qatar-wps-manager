import { Employee, EmployerSettings } from "@/types/employee";

const STORAGE_KEYS = {
  EMPLOYEES: "wps_employees",
  EMPLOYER: "wps_employer",
} as const;

export const storage = {
  getEmployees: (): Employee[] => {
    try {
      const data = sessionStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setEmployees: (employees: Employee[]): void => {
    sessionStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  },

  getEmployer: (): EmployerSettings | null => {
    try {
      const data = sessionStorage.getItem(STORAGE_KEYS.EMPLOYER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setEmployer: (employer: EmployerSettings): void => {
    sessionStorage.setItem(STORAGE_KEYS.EMPLOYER, JSON.stringify(employer));
  },

  clearAll: (): void => {
    sessionStorage.clear();
  },

  hasData: (): boolean => {
    return sessionStorage.length > 0;
  },
};
