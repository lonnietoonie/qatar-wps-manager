import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileJson, UserPlus, Database, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppContext } from "@/context/AppContext";
import { storage } from "@/utils/storage";
import { parseSifCsv } from "@/utils/sif";
import { getSampleEmployees, getSampleEmployer } from "@/utils/sampleData";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const navigate = useNavigate();
  const { setEmployees, setEmployer, clearAll } = useAppContext();
  const [hasExistingData] = useState(storage.hasData());

  const handleSifUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const { employees, employer } = parseSifCsv(content);
        
        setEmployees(employees);
        if (employer) setEmployer(employer);
        
        toast({
          title: "SIF CSV imported successfully",
          description: `Loaded ${employees.length} employees`,
        });
        
        navigate("/people");
      } catch (error) {
        toast({
          title: "Import failed",
          description: error instanceof Error ? error.message : "Invalid file format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleJsonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const employees = JSON.parse(content);
        
        if (!Array.isArray(employees)) {
          throw new Error("Invalid JSON format: expected an array of employees");
        }
        
        setEmployees(employees);
        
        toast({
          title: "JSON imported successfully",
          description: `Loaded ${employees.length} employees`,
        });
        
        navigate("/people");
      } catch (error) {
        toast({
          title: "Import failed",
          description: error instanceof Error ? error.message : "Invalid JSON format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleLoadSampleData = () => {
    setEmployees(getSampleEmployees());
    setEmployer(getSampleEmployer());
    
    toast({
      title: "Sample data loaded",
      description: "3 sample employees and employer settings loaded",
    });
    
    navigate("/people");
  };

  const handleClearAndRestart = () => {
    if (confirm("Are you sure? This will clear all data and cannot be undone.")) {
      clearAll();
      toast({
        title: "Data cleared",
        description: "All data has been removed",
      });
      window.location.reload();
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Qatar WPS Manager</h1>
        <p className="text-lg text-muted-foreground">
          Generate SIF payroll files for the Wage Protection System
        </p>
      </div>

      {hasExistingData && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between gap-4">
            <span className="flex-1">You have an existing session. Continue working or start fresh.</span>
            <Button variant="outline" size="sm" onClick={handleClearAndRestart} className="shrink-0">
              Clear & Restart
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Upload SIF CSV</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Import an existing WPS SIF file to pre-fill employee data
          </p>
          <label className="block">
            <input
              type="file"
              accept=".csv"
              onChange={handleSifUpload}
              className="hidden"
            />
            <Button variant="outline" className="w-full" asChild>
              <span>Choose File</span>
            </Button>
          </label>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
            <FileJson className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Upload JSON</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Import employee data from a JSON file
          </p>
          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={handleJsonUpload}
              className="hidden"
            />
            <Button variant="outline" className="w-full" asChild>
              <span>Choose File</span>
            </Button>
          </label>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Create Manually</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Start with a blank slate and add employees one by one
          </p>
          <Button variant="outline" className="w-full" onClick={() => navigate("/people")}>
            Get Started
          </Button>
        </Card>
      </div>

      <Card className="p-6 mb-8 bg-muted/30">
        <div className="flex items-start gap-3">
          <Database className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="mb-2 font-semibold">Try Sample Data</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Load 3 sample employees to explore the application features
            </p>
            <Button size="sm" onClick={handleLoadSampleData}>
              Load Sample Data
            </Button>
          </div>
        </div>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Privacy Notice:</strong> All data stays in your browser. No information is sent
          to any server. Closing this tab will clear all data permanently.
        </AlertDescription>
      </Alert>
    </div>
  );
}
