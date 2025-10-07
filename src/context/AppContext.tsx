import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Employee, EmployerSettings } from "@/types/employee";
import { storage } from "@/utils/storage";

interface AppContextType {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  employer: EmployerSettings | null;
  setEmployer: (employer: EmployerSettings) => void;
  clearAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployeesState] = useState<Employee[]>([]);
  const [employer, setEmployerState] = useState<EmployerSettings | null>(null);

  useEffect(() => {
    setEmployeesState(storage.getEmployees());
    setEmployerState(storage.getEmployer());
  }, []);

  const setEmployees = (employees: Employee[]) => {
    setEmployeesState(employees);
    storage.setEmployees(employees);
  };

  const setEmployer = (employer: EmployerSettings) => {
    setEmployerState(employer);
    storage.setEmployer(employer);
  };

  const clearAll = () => {
    setEmployeesState([]);
    setEmployerState(null);
    storage.clearAll();
  };

  return (
    <AppContext.Provider value={{ employees, setEmployees, employer, setEmployer, clearAll }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
