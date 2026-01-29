import { RecentScans } from "./components/RecentScans";
import { motion } from "framer-motion";

export default function ScanHistory() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Scan History</h1>
        <p className="text-muted-foreground mt-2">
          View all your past medicine verification scans
        </p>
      </motion.div>

      <RecentScans limit={50} showViewAll={false} />
    </div>
  );
}
