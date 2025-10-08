import { useNavigate } from "react-router-dom";
import { ArrowRight, Upload, Edit3, Download, Shield, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import macbookMockup from "@/assets/macbook-mockup.png";
export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-secondary">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-xl font-bold text-foreground">WPS Manager</span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="lg"
                className="hidden md:flex rounded-xl shadow-md hover:shadow-lg transition-all"
                onClick={() => navigate("/home")}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto max-w-7xl px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              Qatar WPS Manager
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 leading-relaxed font-medium">
              Manage your employees and generate your WPS SIF file - safely in your browser.
            </p>
            <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
              No logins. No servers. No data sent anywhere. All processing happens securely in your browser - your data
              disappears the moment you close the tab.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate("/home")}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-base px-8 py-6 rounded-xl"
                onClick={() => {
                  document.getElementById("how-it-works")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                <span className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-primary rotate-90" />
                  </div>
                  Learn how it works
                </span>
              </Button>
            </div>
          </div>

          {/* MacBook Mockup */}
          <div className="hidden lg:block">
            <img
              src={macbookMockup}
              alt="WPS Manager Application Interface"
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">How it works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to manage your payroll securely
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-8 hover:shadow-xl transition-all border-0 bg-card rounded-2xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Load your data</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upload a previous SIF file or import your employee list from a JSON file.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all border-0 bg-card rounded-2xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10">
              <Edit3 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Make your updates</h3>
            <p className="text-muted-foreground leading-relaxed">
              Edit salaries, add new staff, or adjust payroll details in a clean, table-style view.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all border-0 bg-card rounded-2xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10">
              <Download className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Generate your SIF file</h3>
            <p className="text-muted-foreground leading-relaxed">
              Select who you're paying and instantly create a compliant SIF file - ready for upload to your bank.
            </p>
          </Card>
        </div>
      </section>

      {/* Privacy First Section */}
      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
        <Card className="p-12 md:p-16 bg-card border-0 rounded-3xl shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 flex-shrink-0">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Privacy first</h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                All processing happens in your browser. No data ever leaves your device. When you close the browser,
                your data is gone.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Github className="h-5 w-5" />
          <p className="text-sm md:text-base">
            Prefer to run it yourself?{" "}
            <a
              href="https://github.com/lonnietoonie/qatar-wps-manager"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
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
