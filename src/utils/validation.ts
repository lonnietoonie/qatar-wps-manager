import { Employee, EmployerSettings } from "@/types/employee";

// Field-specific validators per SIF specification
export const validateQid = (qid: string): boolean => {
  if (!qid) return true; // Optional if Visa ID is provided
  return /^\d{11}$/.test(qid.trim());
};

export const validateVisaId = (visaId: string): boolean => {
  if (!visaId) return true; // Optional if QID is provided
  return visaId.trim().length <= 12;
};

export const validateEmployeeName = (name: string): boolean => {
  if (!name) return false;
  return name.trim().length > 0 && name.trim().length <= 70;
};

export const validateBankShortName = (code: string): boolean => {
  if (!code) return false;
  return code.trim().length > 0 && code.trim().length <= 4;
};

export const validateNotes = (notes: string | undefined, reasonCode?: number): boolean => {
  // Notes are mandatory if deduction reason code is 99
  if (reasonCode === 99) {
    if (!notes || notes.trim().length === 0) return false;
  }
  // If provided, must be <= 300 characters
  if (notes && notes.length > 300) return false;
  return true;
};

export const validateExtraHours = (hours: number): boolean => {
  // Must be between 0 and 999.99
  return hours >= 0 && hours <= 999.99;
};

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

  // Employee Name - TEXT(70), Mandatory
  if (!validateEmployeeName(employee.employeeName)) {
    errors.push("Employee name is required and must be 70 characters or less");
  }

  // QID or Visa ID - At least one must be provided
  if (!employee.employeeQid && !employee.employeeVisaId) {
    errors.push("Either QID or Visa ID must be provided");
  }

  // Employee QID - NUMBER(11), Optional
  if (employee.employeeQid && !validateQid(employee.employeeQid)) {
    errors.push("QID must be exactly 11 digits");
  }

  // Employee Visa ID - TEXT(12), Optional
  if (employee.employeeVisaId && !validateVisaId(employee.employeeVisaId)) {
    errors.push("Visa ID must be 12 characters or less");
  }

  // Employee Bank Short Name - TEXT(4), Mandatory
  if (!employee.employeeShortName || !validateBankShortName(employee.employeeShortName)) {
    errors.push("Employee bank short name is required and must be 4 characters or less");
  }

  // Employee IBAN - TEXT(29), Mandatory
  if (!validateIban(employee.employeeIban)) {
    errors.push("Invalid IBAN format (should be QA followed by 2 digits, 4 letters, and 21 characters)");
  }

  // Salary Frequency - CHARACTER(1), Mandatory
  if (employee.salaryFrequency !== "M") {
    errors.push("Salary frequency must be 'M' (Monthly)");
  }

  // Working Days - NUMBER(3), Mandatory
  if (employee.workingDays < 0 || employee.workingDays > 999) {
    errors.push("Working days must be between 0 and 999");
  }

  // Basic Salary - DECIMAL(18,2), Mandatory, must be > 0
  if (employee.basicSalary <= 0) {
    errors.push("Basic salary must be greater than zero");
  }

  // Extra Hours - DECIMAL(3,2), Mandatory
  if (!validateExtraHours(employee.extraHours)) {
    errors.push("Extra hours must be between 0 and 999.99");
  }

  // Extra Income - DECIMAL(18,2), Mandatory (can be 0)
  if (employee.extraIncome < 0) {
    errors.push("Extra income cannot be negative");
  }

  // Deductions - DECIMAL(18,2), Mandatory (can be 0)
  if (employee.deductions < 0) {
    errors.push("Deductions cannot be negative");
  }

  // Deduction Reason Code - NUMBER(2), Conditional (mandatory if deductions > 0)
  if (employee.deductions > 0 && !employee.deductionReasonCode) {
    errors.push("Deduction reason code is required when deductions > 0");
  }

  // Notes/Comments - TEXT(300), Conditional (mandatory if reason code is 99)
  if (!validateNotes(employee.notes, employee.deductionReasonCode)) {
    if (employee.deductionReasonCode === 99) {
      errors.push("Notes are required when deduction reason code is 99 (Other)");
    } else {
      errors.push("Notes must be 300 characters or less");
    }
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
