import { Employee, EmployerSettings } from "@/types/employee";

export const validateIban = (iban: string): boolean => {
  if (!iban) return false;
  
  // Clean and normalize
  const cleaned = iban.replace(/\s/g, "").toUpperCase();
  
  // Check Qatar IBAN format: QA + 2 check digits + 4 bank code + 21 account number = 29 chars
  if (!/^QA\d{2}[A-Z]{4}[A-Z0-9]{21}$/.test(cleaned)) {
    return false;
  }
  
  // MOD-97 checksum validation
  // Move first 4 chars to end: QA58... becomes ...QA58
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);
  
  // Replace letters with numbers (A=10, B=11, ... Z=35)
  const numericString = rearranged
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) { // A-Z
        return (code - 55).toString(); // A=10, B=11, etc.
      }
      return char;
    })
    .join('');
  
  // Calculate mod 97
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
  }
  
  return remainder === 1;
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
