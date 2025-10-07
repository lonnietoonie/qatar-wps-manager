import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Employee, DEDUCTION_REASON_LABELS, PaymentType } from "@/types/employee";
import { validateIban } from "@/utils/validation";
const QATAR_BANKS = [{
  code: "ABQ",
  name: "Al Ahli Bank"
}, {
  code: "ARB",
  name: "Arab Bank"
}, {
  code: "BBQ",
  name: "Barwa Bank"
}, {
  code: "BNP",
  name: "BNP Paribas"
}, {
  code: "CBQ",
  name: "Commercial Bank of Qatar"
}, {
  code: "DBQ",
  name: "Doha Bank"
}, {
  code: "HSB",
  name: "HSBC Bank Middle East"
}, {
  code: "IBQ",
  name: "International Bank of Qatar"
}, {
  code: "IIB",
  name: "Qatar International Islamic Bank"
}, {
  code: "KCB",
  name: "Al Khaliji Bank"
}, {
  code: "MAR",
  name: "Masref Al Rayyan Bank"
}, {
  code: "MSQ",
  name: "Mashreq Bank"
}, {
  code: "QDB",
  name: "Qatar Development Bank"
}, {
  code: "QIB",
  name: "Qatar Islamic Bank"
}, {
  code: "QNB",
  name: "Qatar National Bank"
}, {
  code: "SCB",
  name: "Standard Chartered Bank"
}, {
  code: "UBL",
  name: "United Bank Ltd"
}];
const employeeSchema = z.object({
  employeeName: z.string().min(1, "Employee name is required").max(70, "Employee name must be 70 characters or less"),
  employeeShortName: z.string().min(1, "Bank short name is required").max(4, "Bank short name must be 4 characters or less"),
  employeeQid: z.string().optional().refine(val => !val || /^\d{11}$/.test(val), {
    message: "QID must be exactly 11 digits"
  }),
  employeeVisaId: z.string().optional().refine(val => !val || val.length <= 12, {
    message: "Visa ID must be 12 characters or less"
  }),
  employeeIban: z.string().min(1, "IBAN is required").refine(validateIban, "Invalid IBAN format or checksum"),
  salaryFrequency: z.enum(["M", "B"], {
    required_error: "Salary frequency is required"
  }),
  workingDays: z.number().min(0, "Working days cannot be negative").max(999, "Working days must be 999 or less"),
  basicSalary: z.number().positive("Basic salary must be greater than zero"),
  extraHours: z.number().min(0, "Extra hours cannot be negative").max(999.99, "Extra hours must be 999.99 or less"),
  extraIncome: z.number().min(0, "Extra income cannot be negative"),
  deductions: z.number().min(0, "Deductions cannot be negative"),
  deductionReasonCode: z.number().optional(),
  paymentType: z.enum(["Normal Payment", "Settlement Payment", "Partial Payment", "Delayed Payment", "Final Settlement"]),
  notes: z.string().max(300, "Notes must be 300 characters or less").optional(),
  housingAllowance: z.number().min(0),
  foodAllowance: z.number().min(0),
  transportationAllowance: z.number().min(0),
  overtimeAllowance: z.number().min(0),
  extra1: z.number().min(0),
  extra2: z.number().min(0),
  onLeave: z.boolean()
}).refine(data => data.employeeQid || data.employeeVisaId, {
  message: "Either QID or Visa ID must be provided",
  path: ["employeeQid"]
}).refine(data => {
  // If deductions > 0, deduction reason code is required
  if (data.deductions > 0 && !data.deductionReasonCode) {
    return false;
  }
  return true;
}, {
  message: "Deduction reason code is required when deductions > 0",
  path: ["deductionReasonCode"]
}).refine(data => {
  // If deduction reason code is 99, notes are mandatory
  if (data.deductionReasonCode === 99 && (!data.notes || data.notes.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: "Notes are required when deduction reason is 'Other' (code 99)",
  path: ["notes"]
});
type FormValues = z.infer<typeof employeeSchema>;
interface EmployeeFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  employee: Employee | null;
}
export const EmployeeFormDrawer = ({
  open,
  onClose,
  onSave,
  employee
}: EmployeeFormDrawerProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: {
      errors
    }
  } = useForm<FormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employeeName: "",
      employeeShortName: "",
      salaryFrequency: "M" as "M" | "B",
      workingDays: 22,
      basicSalary: 0,
      extraHours: 0,
      extraIncome: 0,
      deductions: 0,
      paymentType: "Normal Payment",
      housingAllowance: 0,
      foodAllowance: 0,
      transportationAllowance: 0,
      overtimeAllowance: 0,
      extra1: 0,
      extra2: 0,
      onLeave: false
    }
  });
  const [isOtherBank, setIsOtherBank] = useState(employee?.employeeShortName ? !QATAR_BANKS.some(b => b.code === employee.employeeShortName) : false);
  useEffect(() => {
    if (employee) {
      const employeeIsOtherBank = employee.employeeShortName ? !QATAR_BANKS.some(b => b.code === employee.employeeShortName) : false;
      setIsOtherBank(employeeIsOtherBank);
      reset({
        employeeName: employee.employeeName,
        employeeShortName: employee.employeeShortName,
        employeeQid: employee.employeeQid,
        employeeVisaId: employee.employeeVisaId,
        employeeIban: employee.employeeIban,
        salaryFrequency: employee.salaryFrequency,
        workingDays: employee.workingDays,
        basicSalary: employee.basicSalary,
        extraHours: employee.extraHours,
        extraIncome: employee.extraIncome,
        deductions: employee.deductions,
        deductionReasonCode: employee.deductionReasonCode,
        paymentType: employee.paymentType,
        notes: employee.notes,
        housingAllowance: employee.allowances?.housing || 0,
        foodAllowance: employee.allowances?.food || 0,
        transportationAllowance: employee.allowances?.transportation || 0,
        overtimeAllowance: employee.allowances?.overtimeAllowance || 0,
        extra1: employee.allowances?.extra1 || 0,
        extra2: employee.allowances?.extra2 || 0,
        onLeave: employee.onLeave || false
      });
    } else {
      setIsOtherBank(false);
      reset({
        employeeName: "",
        employeeShortName: "",
        salaryFrequency: "M" as "M" | "B",
        workingDays: 22,
        basicSalary: 0,
        extraHours: 0,
        extraIncome: 0,
        deductions: 0,
        paymentType: "Normal Payment",
        housingAllowance: 0,
        foodAllowance: 0,
        transportationAllowance: 0,
        overtimeAllowance: 0,
        extra1: 0,
        extra2: 0,
        onLeave: false
      });
    }
  }, [employee, reset]);
  const onSubmit = (data: FormValues) => {
    const employeeData: Employee = {
      employeeId: employee?.employeeId || "",
      employeeName: data.employeeName,
      employeeShortName: data.employeeShortName || "",
      employeeQid: data.employeeQid,
      employeeVisaId: data.employeeVisaId,
      employeeIban: data.employeeIban,
      salaryFrequency: data.salaryFrequency,
      workingDays: data.workingDays,
      basicSalary: data.basicSalary,
      extraHours: data.extraHours,
      extraIncome: data.extraIncome,
      deductions: data.deductions,
      deductionReasonCode: data.deductionReasonCode as any,
      paymentType: data.paymentType,
      notes: data.notes,
      allowances: {
        housing: data.housingAllowance,
        food: data.foodAllowance,
        transportation: data.transportationAllowance,
        overtimeAllowance: data.overtimeAllowance,
        extra1: data.extra1,
        extra2: data.extra2
      },
      onLeave: data.onLeave
    };
    onSave(employeeData);
  };
  const deductions = watch("deductions");
  return <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{employee ? "Edit Employee" : "Add Employee"}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="employeeName">Employee Name * (max 70 chars)</Label>
              <Input id="employeeName" {...register("employeeName")} maxLength={70} />
              {errors.employeeName && <p className="text-sm text-destructive mt-1">{errors.employeeName.message}</p>}
            </div>

            <div>
              <Label htmlFor="employeeQid">Qatar ID (QID) - 11 digits</Label>
              <Input id="employeeQid" {...register("employeeQid")} maxLength={11} placeholder="12345678901" />
              {errors.employeeQid && <p className="text-sm text-destructive mt-1">{errors.employeeQid.message}</p>}
            </div>

            <div>
              <Label htmlFor="employeeVisaId">Visa ID (max 12 chars)</Label>
              <Input id="employeeVisaId" {...register("employeeVisaId")} maxLength={12} placeholder="VISA123456" />
              {errors.employeeVisaId && <p className="text-sm text-destructive mt-1">{errors.employeeVisaId.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="employeeShortName">Employee Bank Short Name * (max 4 chars)</Label>
              <Select value={isOtherBank ? "OTHER" : watch("employeeShortName") || ""} onValueChange={val => {
              if (val === "OTHER") {
                setIsOtherBank(true);
                setValue("employeeShortName", "");
              } else {
                setIsOtherBank(false);
                setValue("employeeShortName", val);
              }
            }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {QATAR_BANKS.map(bank => <SelectItem key={bank.code} value={bank.code}>
                      {bank.name} ({bank.code})
                    </SelectItem>)}
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {isOtherBank && <Input placeholder="Enter bank short code (max 4 chars)" {...register("employeeShortName")} className="mt-2" maxLength={4} />}
              {errors.employeeShortName && <p className="text-sm text-destructive mt-1">{errors.employeeShortName.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="employeeIban">IBAN *</Label>
              <Input id="employeeIban" {...register("employeeIban")} placeholder="QA58DOHB00001234567890ABCDEFG" />
              {errors.employeeIban && <p className="text-sm text-destructive mt-1">{errors.employeeIban.message}</p>}
            </div>

            <div>
              <Label htmlFor="salaryFrequency">Salary Frequency *</Label>
              <Select value={watch("salaryFrequency")} onValueChange={val => setValue("salaryFrequency", val as "M" | "B")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">M – Monthly</SelectItem>
                  <SelectItem value="B">B – Bi-weekly</SelectItem>
                </SelectContent>
              </Select>
              {errors.salaryFrequency && <p className="text-sm text-destructive mt-1">{errors.salaryFrequency.message}</p>}
            </div>

            <div>
              <Label htmlFor="workingDays">Working Days</Label>
              <Input id="workingDays" type="number" {...register("workingDays", {
              valueAsNumber: true
            })} />
              {errors.workingDays && <p className="text-sm text-destructive mt-1">{errors.workingDays.message}</p>}
            </div>

            <div>
              <Label htmlFor="basicSalary">Basic Salary *</Label>
              <Input id="basicSalary" type="number" step="0.01" {...register("basicSalary", {
              valueAsNumber: true
            })} />
              {errors.basicSalary && <p className="text-sm text-destructive mt-1">{errors.basicSalary.message}</p>}
            </div>

            <div>
              <Label htmlFor="extraHours">Extra Hours (0-999.99)</Label>
              <Input id="extraHours" type="number" step="0.01" {...register("extraHours", {
              valueAsNumber: true
            })} />
              {errors.extraHours && <p className="text-sm text-destructive mt-1">{errors.extraHours.message}</p>}
            </div>

            <div>
              <Label htmlFor="extraIncome">Extra Income</Label>
              <Input id="extraIncome" type="number" step="0.01" {...register("extraIncome", {
              valueAsNumber: true
            })} />
            </div>

            <div>
              <Label htmlFor="deductions">Deductions</Label>
              <Input id="deductions" type="number" step="0.01" {...register("deductions", {
              valueAsNumber: true
            })} />
            </div>

            {deductions > 0 && <div>
                <Label htmlFor="deductionReasonCode">Deduction Reason *</Label>
                <Select value={watch("deductionReasonCode")?.toString()} onValueChange={val => setValue("deductionReasonCode", parseInt(val) as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DEDUCTION_REASON_LABELS).map(([code, label]) => <SelectItem key={code} value={code}>
                        {code}: {label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.deductionReasonCode && <p className="text-sm text-destructive mt-1">{errors.deductionReasonCode.message}</p>}
              </div>}

            <div>
              <Label htmlFor="paymentType">Payment Type</Label>
              <Select value={watch("paymentType")} onValueChange={val => setValue("paymentType", val as PaymentType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal Payment">Normal Payment</SelectItem>
                  <SelectItem value="Settlement Payment">Settlement Payment</SelectItem>
                  <SelectItem value="Partial Payment">Partial Payment</SelectItem>
                  <SelectItem value="Delayed Payment">Delayed Payment</SelectItem>
                  <SelectItem value="Final Settlement">Final Settlement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Label>Allowances</Label>
              <div className="grid gap-3 sm:grid-cols-3 mt-2">
                <div>
                  <Label htmlFor="housingAllowance" className="text-sm">Housing</Label>
                  <Input id="housingAllowance" type="number" step="0.01" {...register("housingAllowance", {
                  valueAsNumber: true
                })} />
                </div>
                <div>
                  <Label htmlFor="foodAllowance" className="text-sm">Food</Label>
                  <Input id="foodAllowance" type="number" step="0.01" {...register("foodAllowance", {
                  valueAsNumber: true
                })} />
                </div>
                <div>
                  <Label htmlFor="transportationAllowance" className="text-sm">Transportation</Label>
                  <Input id="transportationAllowance" type="number" step="0.01" {...register("transportationAllowance", {
                  valueAsNumber: true
                })} />
                </div>
                <div>
                  <Label htmlFor="overtimeAllowance" className="text-sm">Overtime</Label>
                  <Input id="overtimeAllowance" type="number" step="0.01" {...register("overtimeAllowance", {
                  valueAsNumber: true
                })} />
                </div>
                <div>
                  <Label htmlFor="extra1" className="text-sm">Extra 1</Label>
                  <Input id="extra1" type="number" step="0.01" {...register("extra1", {
                  valueAsNumber: true
                })} />
                </div>
                <div>
                  <Label htmlFor="extra2" className="text-sm">Extra 2</Label>
                  <Input id="extra2" type="number" step="0.01" {...register("extra2", {
                  valueAsNumber: true
                })} />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="notes">
                Notes / Comments {watch("deductionReasonCode") === 99 && "* (Required for 'Other' reason)"} (max 300 chars)
              </Label>
              <Input id="notes" {...register("notes")} maxLength={300} />
              {errors.notes && <p className="text-sm text-destructive mt-1">{errors.notes.message}</p>}
            </div>

            <div className="sm:col-span-2 flex items-center space-x-2">
              <Checkbox id="onLeave" checked={watch("onLeave")} onCheckedChange={checked => setValue("onLeave", !!checked)} />
              <Label htmlFor="onLeave" className="cursor-pointer">
                Employee is on leave (net salary will be zero)
              </Label>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {employee ? "Update" : "Add"} Employee
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>;
};