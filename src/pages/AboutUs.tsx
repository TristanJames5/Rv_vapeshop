import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Facebook } from 'lucide-react';

export default function AboutUs() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-12 text-center"
      >
        <motion.div variants={item}>
          <h1 className="font-display text-5xl md:text-6xl text-primary mb-4 tracking-wider">
            ABOUT RV VAPESHOP
          </h1>
          <p className="text-muted-foreground font-sans text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Your premier destination for high-quality vapes, e-liquids, and accessories. 
            We are dedicated to providing the best products and customer service in Sorsogon City.
          </p>
        </motion.div>

        <motion.div variants={item} className="grid md:grid-cols-2 gap-6 mt-16 max-w-3xl mx-auto text-left">
          
          <div className="bg-card border border-white/10 p-8 rounded-xl shadow-2xl hover:border-primary/40 transition-colors group">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MapPin className="text-primary" size={24} />
            </div>
            <h3 className="font-display text-xl text-foreground mb-2">Visit Our Store</h3>
            <p className="text-muted-foreground font-sans">
              OLV Pangpang, 9th Street Baba<br />
              Sorsogon City
            </p>
          </div>

          <div className="bg-card border border-white/10 p-8 rounded-xl shadow-2xl hover:border-primary/40 transition-colors group">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clock className="text-primary" size={24} />
            </div>
            <h3 className="font-display text-xl text-foreground mb-2">Store Hours</h3>
            <p className="text-muted-foreground font-sans">
              Open Daily<br />
              10:00 AM - 10:00 PM
            </p>
          </div>

          <div className="bg-card border border-white/10 p-8 rounded-xl shadow-2xl hover:border-primary/40 transition-colors group">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Phone className="text-primary" size={24} />
            </div>
            <h3 className="font-display text-xl text-foreground mb-2">Contact Us</h3>
            <p className="text-muted-foreground font-sans">
              09664077283
            </p>
          </div>

          <div className="bg-card border border-white/10 p-8 rounded-xl shadow-2xl hover:border-primary/40 transition-colors group">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mail className="text-primary" size={24} />
            </div>
            <h3 className="font-display text-xl text-foreground mb-2">Email</h3>
            <a href="mailto:vendikmand@gmail.com" className="text-muted-foreground font-sans hover:text-primary transition-colors">
              vendikmand@gmail.com
            </a>
          </div>

        </motion.div>

        <motion.div variants={item} className="pt-12 border-t border-white/10 max-w-xl mx-auto">
          <h3 className="font-display text-2xl text-foreground mb-6">Connect With Us</h3>
          <a 
            href="https://facebook.com/Rvvapeshop" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/30 px-8 py-4 rounded-full font-sans font-medium transition-all hover:scale-105"
          >
            <Facebook size={24} />
            Follow Rvvapeshop on Facebook
          </a>
        </motion.div>

      </motion.div>
    </div>
  );
}
