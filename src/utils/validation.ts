import { Employee, EmployerSettings } from "@/types/employee";

export const validateIban = (iban: string): boolean => {
  if (!iban) return false;
  const cleaned = iban.replace(/\s/g, "").toUpperCase();
  return /^QA\d{2}[A-Z]{4}\d{21}$/.test(cleaned);
};

export const validateEmployee = (employee: Employee): string[] => {
  const errors: string[] = [];

  if (!employee.employeeName?.trim()) {
    errors.push("Employee name is required");
  }

  if (!employee.employeeQid && !employee.employeeVisaId) {
    errors.push("Either QID or Visa ID must be provided");
  }

  if (!validateIban(employee.employeeIban)) {
    errors.push("Invalid IBAN format (should be QA followed by 2 digits, 4 letters, and 21 digits)");
  }

  if (employee.basicSalary <= 0) {
    errors.push("Basic salary must be greater than zero");
  }

  if (employee.workingDays < 0) {
    errors.push("Working days cannot be negative");
  }

  if (employee.deductions < 0) {
    errors.push("Deductions cannot be negative");
  }

  if (employee.deductions > 0 && !employee.deductionReasonCode) {
    errors.push("Deduction reason code is required when deductions > 0");
  }

  if (employee.salaryFrequency !== "M") {
    errors.push("Salary frequency must be 'M' (Monthly)");
  }

  return errors;
};

export const validateEmployerSettings = (settings: EmployerSettings): string[] => {
  const errors: string[] = [];

  if (!settings.employerId?.trim()) {
    errors.push("Employer ID (Computer card number) is required");
  }

  if (!settings.payerEid?.trim()) {
    errors.push("Payer EID is required");
  }

  if (!settings.payerBankShortName?.trim()) {
    errors.push("Payer bank short name (BSI) is required");
  }

  if (!validateIban(settings.payerIban)) {
    errors.push("Invalid payer IBAN format");
  }

  if (settings.sifVersion !== 1) {
    errors.push("SIF version must be 1");
  }

  return errors;
};

export const calculateNetSalary = (employee: Employee): number => {
  if (employee.onLeave) {
    return 0;
  }

  const allowancesTotal = Object.values(employee.allowances || {}).reduce(
    (sum, val) => sum + (val || 0),
    0
  );

  return (
    employee.basicSalary +
    employee.extraIncome +
    allowancesTotal -
    employee.deductions
  );
};
