import { useEffect } from "react";
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

const employeeSchema = z.object({
  employeeName: z.string().min(1, "Name is required"),
  employeeShortName: z.string().optional(),
  employeeQid: z.string().optional(),
  employeeVisaId: z.string().optional(),
  employeeIban: z.string().min(1, "IBAN is required").refine(validateIban, "Invalid IBAN format or checksum"),
  workingDays: z.number().min(0),
  basicSalary: z.number().min(0.01, "Basic salary must be greater than zero"),
  extraHours: z.number().min(0),
  extraIncome: z.number().min(0),
  deductions: z.number().min(0),
  deductionReasonCode: z.number().optional(),
  paymentType: z.enum(["Salary", "Settlement"]),
  notes: z.string().optional(),
  housingAllowance: z.number().min(0),
  foodAllowance: z.number().min(0),
  transportationAllowance: z.number().min(0),
  overtimeAllowance: z.number().min(0),
  extra1: z.number().min(0),
  extra2: z.number().min(0),
  onLeave: z.boolean(),
}).refine((data) => data.employeeQid || data.employeeVisaId, {
  message: "Either QID or Visa ID must be provided",
  path: ["employeeQid"],
});

type FormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  employee: Employee | null;
}

export const EmployeeFormDrawer = ({ open, onClose, onSave, employee }: EmployeeFormDrawerProps) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employeeName: "",
      workingDays: 22,
      basicSalary: 0,
      extraHours: 0,
      extraIncome: 0,
      deductions: 0,
      paymentType: "Salary",
      housingAllowance: 0,
      foodAllowance: 0,
      transportationAllowance: 0,
      overtimeAllowance: 0,
      extra1: 0,
      extra2: 0,
      onLeave: false,
    },
  });

  useEffect(() => {
    if (employee) {
      reset({
        employeeName: employee.employeeName,
        employeeShortName: employee.employeeShortName,
        employeeQid: employee.employeeQid,
        employeeVisaId: employee.employeeVisaId,
        employeeIban: employee.employeeIban,
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
        onLeave: employee.onLeave || false,
      });
    } else {
      reset({
        employeeName: "",
        workingDays: 22,
        basicSalary: 0,
        extraHours: 0,
        extraIncome: 0,
        deductions: 0,
        paymentType: "Salary",
        housingAllowance: 0,
        foodAllowance: 0,
        transportationAllowance: 0,
        overtimeAllowance: 0,
        extra1: 0,
        extra2: 0,
        onLeave: false,
      });
    }
  }, [employee, reset]);

  const onSubmit = (data: FormValues) => {
    const employeeData: Employee = {
      employeeId: employee?.employeeId || "",
      employeeName: data.employeeName,
      employeeShortName: data.employeeShortName,
      employeeQid: data.employeeQid,
      employeeVisaId: data.employeeVisaId,
      employeeIban: data.employeeIban,
      salaryFrequency: "M",
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
        extra2: data.extra2,
      },
      onLeave: data.onLeave,
    };

    onSave(employeeData);
  };

  const deductions = watch("deductions");

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{employee ? "Edit Employee" : "Add Employee"}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="employeeName">Employee Name *</Label>
              <Input id="employeeName" {...register("employeeName")} />
              {errors.employeeName && (
                <p className="text-sm text-destructive mt-1">{errors.employeeName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="employeeShortName">Short Name</Label>
              <Input id="employeeShortName" {...register("employeeShortName")} />
            </div>

            <div>
              <Label htmlFor="employeeQid">Qatar ID (QID)</Label>
              <Input id="employeeQid" {...register("employeeQid")} />
            </div>

            <div>
              <Label htmlFor="employeeVisaId">Visa ID</Label>
              <Input id="employeeVisaId" {...register("employeeVisaId")} />
              {errors.employeeQid && (
                <p className="text-sm text-destructive mt-1">{errors.employeeQid.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="employeeIban">IBAN *</Label>
              <Input id="employeeIban" {...register("employeeIban")} placeholder="QA58DOHB00001234567890ABCDEFG" />
              {errors.employeeIban && (
                <p className="text-sm text-destructive mt-1">{errors.employeeIban.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="workingDays">Working Days</Label>
              <Input
                id="workingDays"
                type="number"
                {...register("workingDays", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="basicSalary">Basic Salary *</Label>
              <Input
                id="basicSalary"
                type="number"
                step="0.01"
                {...register("basicSalary", { valueAsNumber: true })}
              />
              {errors.basicSalary && (
                <p className="text-sm text-destructive mt-1">{errors.basicSalary.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="extraHours">Extra Hours</Label>
              <Input
                id="extraHours"
                type="number"
                step="0.01"
                {...register("extraHours", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="extraIncome">Extra Income</Label>
              <Input
                id="extraIncome"
                type="number"
                step="0.01"
                {...register("extraIncome", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="deductions">Deductions</Label>
              <Input
                id="deductions"
                type="number"
                step="0.01"
                {...register("deductions", { valueAsNumber: true })}
              />
            </div>

            {deductions > 0 && (
              <div>
                <Label htmlFor="deductionReasonCode">Deduction Reason *</Label>
                <Select
                  onValueChange={(val) => setValue("deductionReasonCode", parseInt(val) as any)}
                  defaultValue={employee?.deductionReasonCode?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DEDUCTION_REASON_LABELS).map(([code, label]) => (
                      <SelectItem key={code} value={code}>
                        {code}: {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="paymentType">Payment Type</Label>
              <Select
                onValueChange={(val) => setValue("paymentType", val as PaymentType)}
                defaultValue={employee?.paymentType || "Salary"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="Settlement">Settlement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Label>Allowances</Label>
              <div className="grid gap-3 sm:grid-cols-3 mt-2">
                <div>
                  <Label htmlFor="housingAllowance" className="text-sm">Housing</Label>
                  <Input
                    id="housingAllowance"
                    type="number"
                    step="0.01"
                    {...register("housingAllowance", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="foodAllowance" className="text-sm">Food</Label>
                  <Input
                    id="foodAllowance"
                    type="number"
                    step="0.01"
                    {...register("foodAllowance", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="transportationAllowance" className="text-sm">Transportation</Label>
                  <Input
                    id="transportationAllowance"
                    type="number"
                    step="0.01"
                    {...register("transportationAllowance", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="overtimeAllowance" className="text-sm">Overtime</Label>
                  <Input
                    id="overtimeAllowance"
                    type="number"
                    step="0.01"
                    {...register("overtimeAllowance", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="extra1" className="text-sm">Extra 1</Label>
                  <Input
                    id="extra1"
                    type="number"
                    step="0.01"
                    {...register("extra1", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="extra2" className="text-sm">Extra 2</Label>
                  <Input
                    id="extra2"
                    type="number"
                    step="0.01"
                    {...register("extra2", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="notes">Notes / Comments</Label>
              <Input id="notes" {...register("notes")} />
            </div>

            <div className="sm:col-span-2 flex items-center space-x-2">
              <Checkbox
                id="onLeave"
                {...register("onLeave")}
              />
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
    </Sheet>
  );
};
