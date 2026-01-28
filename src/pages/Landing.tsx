import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { ShieldCheck, Activity, Scan, ArrowRight, Lock } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Dhanvantari" className="h-8 w-8" />
            <span className="font-bold text-xl">Dhanvantari</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/auth")}>Sign In</Button>
            <Button onClick={() => navigate("/auth")}>Get Started</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Secure Pharmaceutical Verification & Health Management
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Combat counterfeit medicines and manage your health records with our AI-powered blockchain platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8" onClick={() => navigate("/auth")}>
                  Start Verifying <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-2xl border shadow-sm"
              >
                <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <Scan className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Medicine Scanning</h3>
                <p className="text-muted-foreground">
                  Instantly verify medicine authenticity by scanning packaging. Our AI detects counterfeits and checks expiry dates.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-2xl border shadow-sm"
              >
                <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Blockchain Verification</h3>
                <p className="text-muted-foreground">
                  Immutable supply chain tracking ensures every medicine is traceable from manufacturer to patient.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-card p-8 rounded-2xl border shadow-sm"
              >
                <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Health Records</h3>
                <p className="text-muted-foreground">
                  Securely store and manage your prescriptions, lab reports, and medical history in one private vault.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Trusted by Healthcare Providers</h2>
            <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale">
              {/* Placeholders for partner logos */}
              <div className="flex items-center gap-2 text-xl font-bold"><Lock className="h-6 w-6" /> SecureMed</div>
              <div className="flex items-center gap-2 text-xl font-bold"><Activity className="h-6 w-6" /> HealthChain</div>
              <div className="flex items-center gap-2 text-xl font-bold"><ShieldCheck className="h-6 w-6" /> PharmaGuard</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.svg" alt="Dhanvantari" className="h-6 w-6 opacity-50" />
            <span className="font-semibold">Dhanvantari</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Dhanvantari Health AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}