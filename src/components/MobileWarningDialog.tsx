import { useEffect, useState } from "react";
import { Monitor } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SESSION_KEY = "mobile-warning-shown";

export const MobileWarningDialog = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if we're on mobile/tablet
    const isMobile = window.innerWidth < 1024;
    
    // Check if warning has been shown this session
    const hasShown = sessionStorage.getItem(SESSION_KEY);
    
    if (isMobile && !hasShown) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(SESSION_KEY, "true");
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Monitor className="h-8 w-8 text-primary" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-xl">
            Best viewed on desktop
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base">
            This application is optimized for desktop screens. For the best experience managing employees and generating payroll files, we recommend using a larger display.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction onClick={handleClose} className="w-full sm:w-auto">
            Got it, continue anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};