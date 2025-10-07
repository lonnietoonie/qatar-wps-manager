import { useState, useMemo } from "react";
import { Plus, Trash2, Download, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/AppContext";
import { EmployeeTable } from "@/components/EmployeeTable";
import { EmployeeFormDrawer } from "@/components/EmployeeFormDrawer";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Employee } from "@/types/employee";
import { downloadFile } from "@/utils/sif";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

export default function People() {
  const { employees, setEmployees } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;
    
    const query = searchQuery.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.employeeName.toLowerCase().includes(query) ||
        emp.employeeQid?.toLowerCase().includes(query) ||
        emp.employeeVisaId?.toLowerCase().includes(query) ||
        emp.employeeIban.toLowerCase().includes(query)
    );
  }, [employees, searchQuery]);

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setDrawerOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setDrawerOpen(true);
  };

  const handleSaveEmployee = (employee: Employee) => {
    if (editingEmployee) {
      setEmployees(employees.map((e) => (e.employeeId === employee.employeeId ? employee : e)));
      toast({ title: "Employee updated successfully" });
    } else {
      const newEmployee = { ...employee, employeeId: uuidv4() };
      setEmployees([...employees, newEmployee]);
      toast({ title: "Employee added successfully" });
    }
    setDrawerOpen(false);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setEmployees(employees.filter((e) => !selectedIds.has(e.employeeId)));
    setSelectedIds(new Set());
    toast({ title: `Deleted ${selectedIds.size} employee(s)` });
    setDeleteDialogOpen(false);
  };

  const handleExportJson = () => {
    const json = JSON.stringify(employees, null, 2);
    downloadFile(json, "employees.json", "application/json");
    toast({ title: "Exported employees to JSON" });
  };

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content);
        
        if (!Array.isArray(imported)) {
          throw new Error("Invalid JSON format");
        }

        if (
          employees.length > 0 &&
          !confirm("This will replace all existing employees. Continue?")
        ) {
          return;
        }

        setEmployees(imported);
        toast({
          title: "Import successful",
          description: `Loaded ${imported.length} employees`,
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: error instanceof Error ? error.message : "Invalid file",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Employees</h1>
        <p className="text-muted-foreground">
          Manage your company staff with spreadsheet-like inline editing
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <Button onClick={handleAddEmployee}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>

        <Button
          variant="destructive"
          onClick={handleDeleteSelected}
          disabled={selectedIds.size === 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Selected ({selectedIds.size})
        </Button>

        <label className="cursor-pointer">
          <input
            type="file"
            accept=".json"
            onChange={handleImportJson}
            className="hidden"
          />
          <Button variant="outline" asChild>
            <span>
              <Upload className="mr-2 h-4 w-4" />
              Import JSON
            </span>
          </Button>
        </label>

        <Button variant="outline" onClick={handleExportJson} disabled={employees.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export JSON
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, QID, Visa ID, or IBAN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80"
          />
        </div>
      </div>

      <EmployeeTable
        employees={filteredEmployees}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onEditEmployee={handleEditEmployee}
      />

      <EmployeeFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Employees"
        description={`Are you sure you want to delete ${selectedIds.size} employee(s)? This action cannot be undone.`}
      />
    </div>
  );
}
