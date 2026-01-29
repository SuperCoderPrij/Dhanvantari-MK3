import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Wallet, 
  QrCode, 
  ShieldCheck, 
  FileText, 
  Smartphone, 
  PlusCircle, 
  LayoutDashboard,
  Download,
  ExternalLink,
  ScanLine,
  Keyboard
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserGuide() {
  return (
    <section className="relative z-10 py-24 px-4 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              User Guide
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Comprehensive instructions for Manufacturers and Consumers to navigate the Dhanvantari ecosystem.
          </p>
        </motion.div>

        <Tabs defaultValue="manufacturer" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-slate-950/80 border border-slate-800 p-1.5 h-auto backdrop-blur-xl rounded-full">
              <TabsTrigger 
                value="manufacturer" 
                className="rounded-full px-8 py-3 text-base md:text-lg text-gray-400 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 data-[state=active]:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all"
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                For Manufacturers
              </TabsTrigger>
              <TabsTrigger 
                value="consumer" 
                className="rounded-full px-8 py-3 text-base md:text-lg text-gray-400 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all"
              >
                <Smartphone className="mr-2 h-5 w-5" />
                For Consumers
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="manufacturer" className="space-y-12">
            {/* Wallet Setup Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Wallet className="h-6 w-6 text-cyan-400" />
                Setting Up Your Wallet
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900/40 p-6 rounded-xl border border-cyan-500/20">
                  <h4 className="text-lg font-semibold text-cyan-300 mb-4">Step 1: Install MetaMask</h4>
                  <p className="text-gray-400 mb-4">
                    Dhanvantari uses the Polygon blockchain. You need a Web3 wallet like MetaMask to interact with it.
                  </p>
                  <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10" onClick={() => window.open("https://metamask.io/download/", "_blank")}>
                    Download MetaMask <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-slate-900/40 p-6 rounded-xl border border-cyan-500/20">
                  <h4 className="text-lg font-semibold text-cyan-300 mb-4">Step 2: Connect & Configure</h4>
                  <ul className="space-y-3 text-gray-400 text-sm">
                    <li className="flex gap-2">
                      <span className="bg-cyan-500/20 text-cyan-400 w-6 h-6 rounded-full flex items-center justify-center shrink-0">1</span>
                      Create a new wallet and securely save your Secret Recovery Phrase.
                    </li>
                    <li className="flex gap-2">
                      <span className="bg-cyan-500/20 text-cyan-400 w-6 h-6 rounded-full flex items-center justify-center shrink-0">2</span>
                      Click "Connect Wallet" in the Manufacturer Portal.
                    </li>
                    <li className="flex gap-2">
                      <span className="bg-cyan-500/20 text-cyan-400 w-6 h-6 rounded-full flex items-center justify-center shrink-0">3</span>
                      Ensure you are connected to the <strong>Polygon Amoy Testnet</strong>. The app will prompt you to switch if needed.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Portal Manual Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <LayoutDashboard className="h-6 w-6 text-cyan-400" />
                Manufacturer Portal Manual
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-900/40 border-cyan-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 text-lg">Create Medicine (Minting)</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-400 text-sm space-y-2">
                    <p>Go to the <strong>Mint New</strong> tab.</p>
                    <p>Fill in medicine details (Name, Batch #, Expiry, etc.).</p>
                    <p>Click "Mint Batch" to create a digital twin on the blockchain. This requires a small amount of MATIC for gas fees.</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/40 border-cyan-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 text-lg">Generate QR Codes</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-400 text-sm space-y-2">
                    <p>Navigate to <strong>Generate QR</strong>.</p>
                    <p>Select a previously minted batch.</p>
                    <p>Download the generated QR codes to print on your packaging. Each unit can have a unique serial if needed.</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/40 border-cyan-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 text-lg">Monitor & Report</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-400 text-sm space-y-2">
                    <p>Use the <strong>Dashboard</strong> to view scan analytics.</p>
                    <p>Check the <strong>Reports</strong> tab to see consumer-submitted reports of suspicious medicines.</p>
                    <p>Update the status of reports as you investigate them.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="consumer" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-900/40 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-purple-400">
                    <ScanLine className="h-6 w-6" />
                    1. Scan Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <p>Access the scanner from the Dashboard or Home page. You have two ways to verify:</p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-400">
                    <li><strong className="text-white">Camera Scan:</strong> Point your device's camera at the QR code on the medicine packaging.</li>
                    <li><strong className="text-white">Manual Entry:</strong> If the QR is damaged, enter the Batch ID or Token ID manually in the input field.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/40 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-purple-400">
                    <ShieldCheck className="h-6 w-6" />
                    2. Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <p>Instantly receive verification results:</p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-400">
                    <li><strong className="text-green-400">Authentic:</strong> The medicine is verified on the blockchain. You'll see manufacturing details and expiry dates.</li>
                    <li><strong className="text-red-400">Suspicious:</strong> The code is invalid or not found. Do not consume the product.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/40 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-purple-400">
                    <FileText className="h-6 w-6" />
                    3. Reporting
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <p>Help keep the community safe:</p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-400">
                    <li>If a scan fails or you suspect a fake, use the <strong className="text-white">Report Form</strong> below.</li>
                    <li>Provide details like location and photos to help manufacturers take action.</li>
                    <li>View your scan history in the Dashboard to track past verifications.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}