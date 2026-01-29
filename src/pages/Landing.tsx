import { motion } from "framer-motion";
import { Navbar } from "./landing/Navbar";
import { Hero } from "./landing/Hero";
import { HowItWorks } from "./landing/HowItWorks";
import { UserGuide } from "./landing/UserGuide";
import { CTA } from "./landing/CTA";
import { ReportForm } from "./landing/ReportForm";
import { Location } from "./landing/Location";
import { Footer } from "./landing/Footer";
import { GeminiChatbot } from "@/components/GeminiChatbot";

export default function Landing() {
  console.log("Landing page loaded - v3");
  
  // Generate random stars for background animation
  // Layer 1: Bright, slow twinkling stars
  const stars = Array.from({ length: 150 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5
  }));

  // Layer 2: Small, fast twinkling stars (dust)
  const dust = Array.from({ length: 300 }).map((_, i) => ({
    id: i + 1000,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 1 + 0.5,
    duration: Math.random() * 1.5 + 0.5,
    delay: Math.random() * 5
  }));

  return (
    <div className="min-h-screen bg-[#030014] text-white overflow-x-hidden font-sans selection:bg-cyan-500/30 relative">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-[#030014] to-cyan-900/10 z-0 pointer-events-none" />
      
      {/* Animated Stars - Layer 1 */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white z-0"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Animated Dust - Layer 2 */}
      {dust.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-cyan-200/50 z-0"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Shooting Stars */}
      <motion.div
        initial={{ left: "-5%", top: "10%", opacity: 0, width: "100px" }}
        animate={{ 
          left: ["-5%", "105%"],
          top: ["10%", "30%"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 7,
          ease: "linear"
        }}
        className="absolute h-[1px] bg-gradient-to-r from-transparent via-white to-transparent z-0 rotate-12"
      />
      <motion.div
        initial={{ left: "105%", top: "40%", opacity: 0, width: "150px" }}
        animate={{ 
          left: ["105%", "-5%"],
          top: ["40%", "60%"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 12,
          ease: "linear",
          delay: 2
        }}
        className="absolute h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-0 -rotate-12"
      />

      {/* Floating Glow Orbs */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0],
          y: [0, -30, 0],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none z-0"
      />
      <motion.div 
        animate={{ 
          x: [0, -50, 0],
          y: [0, 30, 0],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none z-0"
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0 pointer-events-none" />

      <Navbar />
      <Hero />
      <HowItWorks />
      <UserGuide />
      <CTA />
      <ReportForm />
      <Location />
      <Footer />
      <GeminiChatbot />
    </div>
  );
}