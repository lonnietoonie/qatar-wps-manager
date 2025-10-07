import { Employee, EmployerSettings, PayrollRun } from "@/types/employee";
import { calculateNetSalary } from "./validation";
import { v4 as uuidv4 } from "uuid";

export const generateSifCsv = (
  employees: Employee[],
  employer: EmployerSettings,
  payroll: PayrollRun
): { csv: string; filename: string } => {
  const selectedEmployees = employees.filter((e) => !e.onLeave || true);

  const totalSalaries = selectedEmployees
    .reduce((sum, emp) => sum + calculateNetSalary(emp), 0)
    .toFixed(2);

  const totalRecords = selectedEmployees.length;

  // Header labels (line 0)
  const headerLabels = "Employer EID, File Creation Date, File Creation Time, Payer EID, Payer QID, Payer Bank Short Name, Payer IBAN, Salary Year and Month, Total Salaries, Total Records, SIF Version";

  // Header record (line 1)
  const headerRecord = [
    employer.employerId,
    payroll.fileCreationDate,
    payroll.fileCreationTime,
    employer.payerEid,
    employer.payerQid || "",
    employer.payerBankShortName,
    employer.payerIban,
    payroll.salaryYearMonth,
    totalSalaries,
    totalRecords.toString(),
    employer.sifVersion.toString(),
  ];

  // Column headers for employee records (line 2)
  const columnHeaders = "Record Sequence, Employee QID, Employee Visa ID, Employee Name, Employee Bank Short Name, Employee Account, Salary Frequency, Number of Working days, Net Salary, Basic Salary, Extra hours, Extra income, Deductions, Payment Type,Notes / Comments, Housing Allowance, Food Allowance, Transportation Allowance, Over Time Allowance, Deduction Reason Code, Extra Field 1, Extra Field 2";

  // Employee records
  const employeeRecords = selectedEmployees.map((emp, index) => {
    const recordSequence = String(index + 1).padStart(6, "0");
    const netSalary = calculateNetSalary(emp).toFixed(2);

    return [
      recordSequence,
      emp.employeeQid || "",
      emp.employeeVisaId || "",
      emp.employeeName,
      "", // Employee Bank Short Name - typically empty or from IBAN
      emp.employeeIban,
      emp.salaryFrequency,
      emp.workingDays.toString(),
      netSalary,
      emp.basicSalary.toFixed(2),
      emp.extraHours.toFixed(2),
      emp.extraIncome.toFixed(2),
      emp.deductions.toFixed(2),
      emp.paymentType,
      emp.notes || "",
      (emp.allowances?.housing || 0).toFixed(2),
      (emp.allowances?.food || 0).toFixed(2),
      (emp.allowances?.transportation || 0).toFixed(2),
      (emp.allowances?.overtimeAllowance || 0).toFixed(2),
      emp.deductionReasonCode?.toString() || "0",
      (emp.allowances?.extra1 || 0).toFixed(2),
      (emp.allowances?.extra2 || 0).toFixed(2),
    ];
  });

  const csvLines = [
    headerLabels,
    headerRecord.join(","),
    columnHeaders,
    ...employeeRecords.map((record) => record.join(",")),
  ];

  const csv = csvLines.join("\r\n");

  const filename = `SIF_${employer.employerId}_${employer.payerBankShortName}_${payroll.fileCreationDate}_${payroll.fileCreationTime}.csv`;

  return { csv, filename };
};

export const parseSifCsv = (csvContent: string): { employees: Employee[]; employer: EmployerSettings | null } => {
  const lines = csvContent.split(/\r?\n/).filter((line) => line.trim());

  if (lines.length < 4) {
    throw new Error("Invalid SIF CSV format");
  }

  // Line 0: Header labels (skip)
  // Line 1: Header record (employer info)
  const headerParts = lines[1].split(",");
  const employer: EmployerSettings = {
    employerId: headerParts[0] || "",
    payerEid: headerParts[3] || "",
    payerQid: headerParts[4] || undefined,
    payerBankShortName: headerParts[5] || "",
    payerIban: headerParts[6] || "",
    sifVersion: parseInt(headerParts[10]) || 1,
  };

  // Line 2: Column headers (skip)
  // Lines 3+: Employee records
  const employees: Employee[] = [];

  for (let i = 3; i < lines.length; i++) {
    const parts = lines[i].split(",");
    if (parts.length < 22) continue;

    const employee: Employee = {
      employeeId: uuidv4(),
      employeeName: parts[3] || "",
      employeeShortName: undefined,
      employeeQid: parts[1] || undefined,
      employeeVisaId: parts[2] || undefined,
      employeeIban: parts[5] || "",
      salaryFrequency: "M",
      workingDays: parseInt(parts[7]) || 0,
      basicSalary: parseFloat(parts[9]) || 0,
      extraHours: parseFloat(parts[10]) || 0,
      extraIncome: parseFloat(parts[11]) || 0,
      deductions: parseFloat(parts[12]) || 0,
      deductionReasonCode: parts[19] && parts[19] !== "0" ? (parseInt(parts[19]) as any) : undefined,
      paymentType: parts[13] === "Settlement" ? "Settlement" : "Salary",
      notes: parts[14] || undefined,
      allowances: {
        housing: parseFloat(parts[15]) || 0,
        food: parseFloat(parts[16]) || 0,
        transportation: parseFloat(parts[17]) || 0,
        overtimeAllowance: parseFloat(parts[18]) || 0,
        extra1: parseFloat(parts[20]) || 0,
        extra2: parseFloat(parts[21]) || 0,
      },
      onLeave: false,
    };

    employees.push(employee);
  }

  return { employees, employer };
};

export const downloadFile = (content: string, filename: string, mimeType: string = "text/csv") => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
