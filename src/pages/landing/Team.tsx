import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Placeholder data - to be updated with user provided info
const teamMembers = [
  {
    name: "Priyanshu Jash",
    role: "Backend & Blockchain Developer",
    image: "https://harmless-tapir-303.convex.cloud/api/storage/02929f82-7a0e-4539-ae94-2914c2aa986c",
    bio: "Architecting the secure blockchain infrastructure and backend systems that power Dhanvantari's anti-counterfeit solution.",
    social: {
      github: "https://github.com/SuperCoderPrij",
      linkedin: "https://www.linkedin.com/in/priyanshu-jash-4602b9247/",
      twitter: "https://x.com/JPriyanshuTalks"
    }
  },
  {
    name: "Neha Yadav",
    role: "Frontend and UI/UX Developer",
    image: "https://harmless-tapir-303.convex.cloud/api/storage/12751e9b-0364-4b0d-9f90-a41cb116b4b4",
    bio: "Crafting intuitive and beautiful user interfaces to ensure a seamless and accessible experience for all users.",
    social: {
      github: "https://github.com/bestfriends3243",
      linkedin: "https://www.linkedin.com/in/neha-yadav-8bb6212ba/"
    }
  },
  {
    name: "Palak Singh",
    role: "Fullstack Developer",
    image: "https://harmless-tapir-303.convex.cloud/api/storage/2fd78898-f068-4570-9f89-97d5ce96abcc",
    bio: "Building robust and scalable full-stack applications to power the Dhanvantari ecosystem.",
    social: {
      github: "https://github.com/Palak-singh26",
      linkedin: "https://www.linkedin.com/in/palak-singh-b2a532322/"
    }
  },
  {
    name: "Soniya Singh",
    role: "Secure Coder & Frontend Developer",
    image: "https://harmless-tapir-303.convex.cloud/api/storage/226e2b36-78dc-4422-9e41-a487910572d7",
    bio: "Specializing in secure coding practices and building responsive, user-friendly frontend interfaces.",
    social: {
      linkedin: "https://www.linkedin.com/in/soniya-singh-712779306/"
    }
  }
];

export function Team() {
  return (
    <section id="team" className="relative z-10 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Meet Our Team
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            The minds behind Dhanvantari's mission to secure the pharmaceutical supply chain.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden hover:border-cyan-500/30 transition-all duration-300 group h-full flex flex-col hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Image Container */}
                  <div className="relative overflow-hidden aspect-[4/5] w-full border-b border-slate-800/50">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* Content Container */}
                  <div className="p-6 flex flex-col flex-grow relative">
                    {/* Decorative line */}
                    <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{member.name}</h3>
                    <p className="text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                      {member.role}
                    </p>
                    
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                      {member.bio}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-800/50">
                      {member.social.linkedin && (
                        <a 
                          href={member.social.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 rounded-full bg-slate-800/50 text-gray-400 hover:bg-[#0077b5] hover:text-white transition-all duration-300 hover:scale-110"
                          title="LinkedIn"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a 
                          href={member.social.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 rounded-full bg-slate-800/50 text-gray-400 hover:bg-black hover:text-white transition-all duration-300 hover:scale-110"
                          title="Twitter / X"
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                      {member.social.github && (
                        <a 
                          href={member.social.github} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 rounded-full bg-slate-800/50 text-gray-400 hover:bg-[#333] hover:text-white transition-all duration-300 hover:scale-110"
                          title="GitHub"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}