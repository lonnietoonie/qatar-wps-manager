export interface EmployeeAllowances {
  housing?: number;
  food?: number;
  transportation?: number;
  overtimeAllowance?: number;
  extra1?: number;
  extra2?: number;
}

export type DeductionReasonCode = 1 | 2 | 3 | 4 | 99;

export const DEDUCTION_REASON_LABELS: Record<DeductionReasonCode, string> = {
  1: "Working hours related",
  2: "Work arrangements",
  3: "Harm or damage",
  4: "Advances",
  99: "Other",
};

export type PaymentType = "Normal Payment" | "Settlement Payment" | "Partial Payment" | "Delayed Payment" | "Final Settlement";

export interface Employee {
  employeeId: string;
  employeeName: string;
  employeeShortName: string;
  employeeQid?: string;
  employeeVisaId?: string;
  employeeIban: string;
  salaryFrequency: "M";
  workingDays: number;
  basicSalary: number;
  extraHours: number;
  extraIncome: number;
  deductions: number;
  deductionReasonCode?: DeductionReasonCode;
  paymentType: PaymentType;
  notes?: string;
  allowances?: EmployeeAllowances;
  onLeave?: boolean;
}

export interface EmployerSettings {
  employerId: string;
  payerEid: string;
  payerQid?: string;
  payerBankShortName: string;
  payerIban: string;
  sifVersion: number;
}

export interface PayrollRun {
  salaryYearMonth: string;
  fileCreationDate: string;
  fileCreationTime: string;
}
