import { useState, useMemo } from "react";
import { FileDown, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAppContext } from "@/context/AppContext";
import { EmployerSettings, PayrollRun } from "@/types/employee";
import { generateSifCsv, downloadFile } from "@/utils/sif";
import { validateEmployerSettings, calculateNetSalary } from "@/utils/validation";
import { toast } from "@/hooks/use-toast";
import { DEDUCTION_REASON_LABELS } from "@/types/employee";

const QATAR_BANKS = [
  { code: "ABQ", name: "Al Ahli Bank" },
  { code: "ARB", name: "Arab Bank" },
  { code: "BBQ", name: "Barwa Bank" },
  { code: "BNP", name: "BNP Paribas" },
  { code: "CBQ", name: "Commercial Bank of Qatar" },
  { code: "DBQ", name: "Doha Bank" },
  { code: "HSB", name: "HSBC Bank Middle East" },
  { code: "IBQ", name: "International Bank of Qatar" },
  { code: "IIB", name: "Qatar International Islamic Bank" },
  { code: "KCB", name: "Al Khaliji Bank" },
  { code: "MAR", name: "Masref Al Rayyan Bank" },
  { code: "MSQ", name: "Mashreq Bank" },
  { code: "QDB", name: "Qatar Development Bank" },
  { code: "QIB", name: "Qatar Islamic Bank" },
  { code: "QNB", name: "Qatar National Bank" },
  { code: "SCB", name: "Standard Chartered Bank" },
  { code: "UBL", name: "United Bank Ltd" },
];

export default function Wps() {
  const { employees, employer, setEmployer } = useAppContext();

  const today = new Date();
  const [payrollRun, setPayrollRun] = useState<PayrollRun>({
    salaryYearMonth: `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}`,
    fileCreationDate: today.toISOString().slice(0, 10).replace(/-/g, ""),
    fileCreationTime: `${String(today.getHours()).padStart(2, "0")}${String(today.getMinutes()).padStart(2, "0")}`,
  });

  const [employerSettings, setEmployerSettings] = useState<EmployerSettings>(
    employer || {
      employerId: "",
      payerEid: "",
      payerQid: "",
      payerBankShortName: "",
      payerIban: "",
      sifVersion: 1,
    }
  );

  const [isOtherBank, setIsOtherBank] = useState(
    employer?.payerBankShortName 
      ? !QATAR_BANKS.some(b => b.code === employer.payerBankShortName)
      : false
  );

  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(
    new Set(employees.filter((e) => !e.onLeave).map((e) => e.employeeId))
  );

  const selectedEmployees = useMemo(
    () => employees.filter((e) => selectedEmployeeIds.has(e.employeeId)),
    [employees, selectedEmployeeIds]
  );

  const summary = useMemo(() => {
    return {
      totalEmployees: selectedEmployees.length,
      totalBasicSalary: selectedEmployees.reduce((sum, e) => sum + e.basicSalary, 0),
      totalDeductions: selectedEmployees.reduce((sum, e) => sum + e.deductions, 0),
      totalNetSalary: selectedEmployees.reduce((sum, e) => sum + calculateNetSalary(e), 0),
    };
  }, [selectedEmployees]);

  const handleGenerateSif = () => {
    const employerErrors = validateEmployerSettings(employerSettings);
    if (employerErrors.length > 0) {
      toast({
        title: "Employer settings incomplete",
        description: employerErrors.join(", "),
        variant: "destructive",
      });
      return;
    }

    if (selectedEmployees.length === 0) {
      toast({
        title: "No employees selected",
        description: "Please select at least one employee",
        variant: "destructive",
      });
      return;
    }

    if (!payrollRun.salaryYearMonth || payrollRun.salaryYearMonth.length !== 6) {
      toast({
        title: "Invalid salary month",
        description: "Salary month must be in YYYYMM format",
        variant: "destructive",
      });
      return;
    }

    try {
      setEmployer(employerSettings);
      const { csv, filename } = generateSifCsv(selectedEmployees, employerSettings, payrollRun);
      downloadFile(csv, filename, "text/csv");
      toast({
        title: "SIF CSV generated successfully",
        description: `File: ${filename}`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const toggleEmployeeSelection = (id: string) => {
    const newSet = new Set(selectedEmployeeIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedEmployeeIds(newSet);
  };

  const allSelected = employees.length > 0 && employees.every((e) => selectedEmployeeIds.has(e.employeeId));

  const toggleAllEmployees = () => {
    if (allSelected) {
      setSelectedEmployeeIds(new Set());
    } else {
      setSelectedEmployeeIds(new Set(employees.map((e) => e.employeeId)));
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">WPS Payroll Generator</h1>
          <p className="text-muted-foreground">Generate SIF CSV files for salary payments</p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <HelpCircle className="mr-2 h-4 w-4" />
              Field Help
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>SIF Field Reference</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Deduction Reason Codes</h4>
                <ul className="space-y-1 text-muted-foreground">
                  {Object.entries(DEDUCTION_REASON_LABELS).map(([code, label]) => (
                    <li key={code}>
                      <strong>{code}:</strong> {label}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Payment Types</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li><strong>Salary:</strong> Regular monthly payment</li>
                  <li><strong>Settlement:</strong> Final settlement or termination payment</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Important Rules</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Basic salary must be greater than zero, even if employee is on leave</li>
                  <li>• If employee is on leave, net salary will be zero</li>
                  <li>• Either QID or Visa ID must be provided</li>
                  <li>• IBAN must be valid Qatar format</li>
                  <li>• Deduction reason code is mandatory when deductions {'>'} 0</li>
                  <li>• Salary frequency is always Monthly (M)</li>
                </ul>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Employer Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="employerId">Employer ID *</Label>
                <Input
                  id="employerId"
                  placeholder="Computer card number"
                  value={employerSettings.employerId}
                  onChange={(e) =>
                    setEmployerSettings({ ...employerSettings, employerId: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="payerEid">Payer EID *</Label>
                <Input
                  id="payerEid"
                  placeholder="Usually same as Employer ID"
                  value={employerSettings.payerEid}
                  onChange={(e) =>
                    setEmployerSettings({ ...employerSettings, payerEid: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="payerQid">Payer QID</Label>
                <Input
                  id="payerQid"
                  placeholder="Optional"
                  value={employerSettings.payerQid || ""}
                  onChange={(e) =>
                    setEmployerSettings({ ...employerSettings, payerQid: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="payerBankShortName">Payer Bank Short Name (BSI) *</Label>
                <Select
                  value={isOtherBank ? "OTHER" : employerSettings.payerBankShortName}
                  onValueChange={(val) => {
                    if (val === "OTHER") {
                      setIsOtherBank(true);
                      setEmployerSettings({ ...employerSettings, payerBankShortName: "" });
                    } else {
                      setIsOtherBank(false);
                      setEmployerSettings({ ...employerSettings, payerBankShortName: val });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {QATAR_BANKS.map((bank) => (
                      <SelectItem key={bank.code} value={bank.code}>
                        {bank.name} ({bank.code})
                      </SelectItem>
                    ))}
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                {isOtherBank && (
                  <Input
                    placeholder="Enter bank short code"
                    value={employerSettings.payerBankShortName}
                    onChange={(e) =>
                      setEmployerSettings({ ...employerSettings, payerBankShortName: e.target.value })
                    }
                    className="mt-2"
                  />
                )}
              </div>

              <div>
                <Label htmlFor="sifVersion">SIF Version</Label>
                <Input id="sifVersion" value="1" disabled />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="payerIban">Payer IBAN *</Label>
                <Input
                  id="payerIban"
                  placeholder="QA58DOHB00001234567890ABCDEFG"
                  value={employerSettings.payerIban}
                  onChange={(e) =>
                    setEmployerSettings({ ...employerSettings, payerIban: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Payroll Run</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="salaryYearMonth">Salary Year & Month *</Label>
              <Input
                id="salaryYearMonth"
                placeholder="YYYYMM (e.g., 202510)"
                value={payrollRun.salaryYearMonth}
                onChange={(e) =>
                  setPayrollRun({ ...payrollRun, salaryYearMonth: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">Format: YYYYMM</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="fileCreationDate">File Creation Date</Label>
                <Input
                  id="fileCreationDate"
                  placeholder="YYYYMMDD"
                  value={payrollRun.fileCreationDate}
                  onChange={(e) =>
                    setPayrollRun({ ...payrollRun, fileCreationDate: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="fileCreationTime">File Creation Time</Label>
                <Input
                  id="fileCreationTime"
                  placeholder="HHmm"
                  value={payrollRun.fileCreationTime}
                  onChange={(e) =>
                    setPayrollRun({ ...payrollRun, fileCreationTime: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Employees</h2>

        {employees.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No employees available. Add employees from the People page first.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-table-header">
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle">
                    <Checkbox checked={allSelected} onCheckedChange={toggleAllEmployees} />
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">QID / Visa</th>
                  <th className="h-12 px-4 text-right align-middle font-medium">Basic</th>
                  <th className="h-12 px-4 text-right align-middle font-medium">Deductions</th>
                  <th className="h-12 px-4 text-right align-middle font-medium">Net</th>
                  <th className="h-12 px-4 text-center align-middle font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr
                    key={employee.employeeId}
                    className="border-b hover:bg-table-row-hover transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedEmployeeIds.has(employee.employeeId)}
                        onCheckedChange={() => toggleEmployeeSelection(employee.employeeId)}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{employee.employeeName}</td>
                    <td className="px-4 py-3 text-sm">
                      {employee.employeeQid ? `QID: ${employee.employeeQid}` : `Visa: ${employee.employeeVisaId}`}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {employee.basicSalary.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-destructive">
                      {employee.deductions > 0 ? employee.deductions.toFixed(2) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">
                      {calculateNetSalary(employee).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      {employee.onLeave ? (
                        <span className="text-accent-foreground">On Leave</span>
                      ) : (
                        <span className="text-secondary-foreground">Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="p-6 mb-6 bg-primary/5">
        <h2 className="text-xl font-semibold mb-4">Payroll Summary</h2>

        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Selected Employees</p>
            <p className="text-2xl font-bold text-primary">{summary.totalEmployees}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Basic Salary</p>
            <p className="text-2xl font-bold font-mono">{summary.totalBasicSalary.toFixed(2)}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Deductions</p>
            <p className="text-2xl font-bold font-mono text-destructive">
              {summary.totalDeductions.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Net Amount</p>
            <p className="text-2xl font-bold font-mono text-secondary">
              {summary.totalNetSalary.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleGenerateSif} disabled={selectedEmployees.length === 0}>
          <FileDown className="mr-2 h-5 w-5" />
          Generate SIF CSV
        </Button>
      </div>
    </div>
  );
}
