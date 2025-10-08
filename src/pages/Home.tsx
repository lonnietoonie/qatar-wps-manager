import { useNavigate } from "react-router-dom";
import { ArrowRight, Upload, Edit3, Download, Shield, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <section className="container mx-auto max-w-5xl px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Manage your employees and generate your WPS SIF file — safely in your browser.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            No logins. No servers. No data sent anywhere. Qatar WPS Manager lets you handle 
            payroll securely, directly in your browser — your data disappears the moment you 
            close the tab.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate("/home")}
            >
              Go to WPS Manager
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn how it works
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
          How it works
        </h2>
        
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="p-8 hover:shadow-lg transition-shadow bg-card">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
              <Upload className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Load your data</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upload a previous SIF file or import your employee list from a JSON file.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow bg-card">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
              <Edit3 className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Make your updates</h3>
            <p className="text-muted-foreground leading-relaxed">
              Edit salaries, add new staff, or adjust payroll details in a clean, table-style view.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow bg-card">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
              <Download className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Generate your SIF file</h3>
            <p className="text-muted-foreground leading-relaxed">
              Select who you're paying and instantly create a compliant SIF file — ready for upload to your bank.
            </p>
          </Card>
        </div>
      </section>

      {/* Privacy First Section */}
      <section className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
        <Card className="p-10 md:p-12 bg-muted border-2">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Privacy first
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                All processing happens in your browser. No data ever leaves your device. 
                When you close the browser, your data is gone.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto max-w-5xl px-4 py-16 border-t">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Github className="h-5 w-5" />
          <p className="text-sm md:text-base">
            Prefer to run it yourself?{" "}
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Download the code from our GitHub repo
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
