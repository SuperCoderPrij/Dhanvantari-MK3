import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";

interface QRScannerProps {
  onScanSuccess: (decodedText: string, decodedResult: any) => void;
  onScanFailure?: (error: any) => void;
}

export default function QRScanner({ onScanSuccess, onScanFailure }: QRScannerProps) {
  const scannerRef = useRef<any | null>(null);

  useEffect(() => {
    // Initialize scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      /* verbose= */ false
    );

    scanner.render(onScanSuccess, onScanFailure);
    scannerRef.current = scanner;

    // Cleanup
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error: any) => {
          console.error("Failed to clear scanner", error);
        });
      }
    };
  }, [onScanSuccess, onScanFailure]);

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden rounded-lg border border-slate-800 bg-black">
      <div id="reader" className="w-full" />
      <style>{`
        #reader__scan_region {
          background: transparent !important;
        }
        #reader__dashboard_section_csr span {
          display: none !important;
        }
        #reader__dashboard_section_swaplink {
          display: none !important;
        }
      `}</style>
    </div>
  );
}