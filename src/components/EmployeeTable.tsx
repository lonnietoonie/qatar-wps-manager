import { Employee } from "@/types/employee";
import { calculateNetSalary } from "@/utils/validation";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface EmployeeTableProps {
  employees: Employee[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onEditEmployee: (employee: Employee) => void;
}

export const EmployeeTable = ({
  employees,
  selectedIds,
  onSelectionChange,
  onEditEmployee,
}: EmployeeTableProps) => {
  const allSelected = employees.length > 0 && employees.every((e) => selectedIds.has(e.employeeId));

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(employees.map((e) => e.employeeId)));
    }
  };

  const toggleOne = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    onSelectionChange(newSet);
  };

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-muted-foreground mb-2">No employees yet</p>
        <p className="text-sm text-muted-foreground">
          Add your first employee to get started
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-table-header">
            <tr className="border-b">
              <th className="h-12 px-4 text-left align-middle font-medium">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium">QID / Visa</th>
              <th className="h-12 px-4 text-left align-middle font-medium">IBAN</th>
              <th className="h-12 px-4 text-right align-middle font-medium">Basic Salary</th>
              <th className="h-12 px-4 text-right align-middle font-medium">Deductions</th>
              <th className="h-12 px-4 text-right align-middle font-medium">Net Salary</th>
              <th className="h-12 px-4 text-center align-middle font-medium">Days</th>
              <th className="h-12 px-4 text-center align-middle font-medium">Status</th>
              <th className="h-12 px-4 text-center align-middle font-medium">Actions</th>
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
                    checked={selectedIds.has(employee.employeeId)}
                    onCheckedChange={() => toggleOne(employee.employeeId)}
                  />
                </td>
                <td className="px-4 py-3 font-medium">{employee.employeeName}</td>
                <td className="px-4 py-3 text-sm">
                  {employee.employeeQid ? `QID: ${employee.employeeQid}` : `Visa: ${employee.employeeVisaId}`}
                </td>
                <td className="px-4 py-3 text-sm font-mono">{employee.employeeIban}</td>
                <td className="px-4 py-3 text-right font-mono">
                  {employee.basicSalary.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-destructive">
                  {employee.deductions > 0 ? employee.deductions.toFixed(2) : "—"}
                </td>
                <td className="px-4 py-3 text-right font-mono font-semibold">
                  {calculateNetSalary(employee).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">{employee.workingDays}</td>
                <td className="px-4 py-3 text-center">
                  {employee.onLeave ? (
                    <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent-foreground">
                      On Leave
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary-foreground">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditEmployee(employee)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
