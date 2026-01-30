import { motion } from "framer-motion";
import { MapPin, Mail, Phone } from "lucide-react";

export function Location() {
  return (
    <section id="location" className="relative z-10 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Visit Our HQ
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Center of Innovation for Blockchain & Healthcare
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 flex flex-col justify-center space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-cyan-500/10 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Headquarters</h3>
                  <p className="text-gray-400">
                    Bharti Vidyapeeth BVDU DMS,<br />
                    Kharghar,<br />
                    Navi Mumbai
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-500/10 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Email Us</h3>
                  <p className="text-gray-400">contact@dhanvantari.ai</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-pink-500/10 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Call Us</h3>
                  <p className="text-gray-400">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 h-[400px] rounded-2xl overflow-hidden border border-slate-800 shadow-[0_0_40px_rgba(6,182,212,0.1)] relative group"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.968667377886!2d73.0634873759619!3d19.02314793280565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c23c43449c57%3A0x60602633d400380!2sBharati%20Vidyapeeth%20Institute%20of%20Management%20Studies%20%26%20Research!5e0!3m2!1sen!2sin!4v1709900000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
            
            {/* Overlay gradient for better integration */}
            <div className="absolute inset-0 pointer-events-none border-4 border-slate-900/50 rounded-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}