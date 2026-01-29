import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Placeholder data - to be updated with user provided info
const teamMembers = [
  {
    name: "Team Member 1",
    role: "Role Title",
    image: "https://github.com/shadcn.png",
    bio: "Passionate about blockchain and healthcare innovation."
  },
  {
    name: "Team Member 2",
    role: "Role Title",
    image: "https://github.com/shadcn.png",
    bio: "Expert in AI and secure systems architecture."
  },
  {
    name: "Team Member 3",
    role: "Role Title",
    image: "https://github.com/shadcn.png",
    bio: "Dedicated to ensuring medicine safety for everyone."
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden hover:border-cyan-500/30 transition-all duration-300 group">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden aspect-square">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-cyan-400 font-medium mb-3">{member.role}</p>
                      <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {member.bio}
                      </p>
                      
                      <div className="flex gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                          <Linkedin className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                          <Twitter className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                          <Github className="h-5 w-5" />
                        </a>
                      </div>
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
