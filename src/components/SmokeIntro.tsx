import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function SmokeIntro() {
  const [stage, setStage] = useState<'gate' | 'playing' | 'done'>('gate');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setStage('done');
    }
  }, []);

  const handleEnter = () => {
    // Start music
    if (audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(e => console.log('Audio playback prevented:', e));
      
      // Fade in audio
      let vol = 0;
      const interval = setInterval(() => {
        if (vol < 0.5) {
          vol += 0.05;
          if (audioRef.current) audioRef.current.volume = vol;
        } else {
          clearInterval(interval);
        }
      }, 200);
    }

    setStage('playing');
    sessionStorage.setItem('hasSeenIntro', 'true');

    // End intro after animation completes (5 seconds)
    setTimeout(() => {
      setStage('done');
    }, 5000);
  };

  if (stage === 'done') return null;

  return (
    <>
      {/* Background Audio */}
      <audio 
        ref={audioRef} 
        src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b817578f.mp3?filename=synthwave-80s-110045.mp3" 
        loop 
        preload="auto"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
        
        <AnimatePresence mode="wait">
          {stage === 'gate' && (
            <motion.div 
              key="gate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center z-20"
            >
              <h1 className="font-display text-4xl text-primary mb-8 tracking-widest text-center px-4">
                ARE YOU 18 OR OLDER?
              </h1>
              <p className="text-muted-foreground font-light mb-8 max-w-md text-center text-sm px-6">
                This website contains nicotine products. You must be of legal smoking age to enter.
              </p>
              <div className="flex gap-4">
                <button onClick={() => window.history.back()} className="px-8 py-3 rounded border border-white/10 text-muted-foreground hover:text-foreground transition-colors">
                  NO, I AM NOT
                </button>
                <button onClick={handleEnter} className="px-8 py-3 bg-primary text-background font-bold rounded hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                  YES, ENTER SHOP
                </button>
              </div>
            </motion.div>
          )}

          {stage === 'playing' && (
            <motion.div 
              key="smoke"
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8 }}
            >
              {/* CSS Smoke Effects from index.css */}
              <div className="smoke-wrapper">
                <div className="smoke-cloud" style={{ animationDuration: '4s' }}></div>
                <div className="smoke-cloud" style={{ animationDuration: '5s' }}></div>
                <div className="smoke-cloud" style={{ animationDuration: '6s' }}></div>
              </div>

              {/* Cinematic Logo Reveal */}
              <motion.div 
                className="z-10 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
              >
                <motion.img 
                  src="/logo.jpg"
                  alt="RV VapeShop"
                  className="w-48 h-48 md:w-64 md:h-64 object-contain mb-2 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                  animate={{ filter: ["drop-shadow(0 0 10px rgba(168,85,247,0))", "drop-shadow(0 0 40px rgba(168,85,247,0.8))", "drop-shadow(0 0 10px rgba(168,85,247,0.2))"] }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                />
                <motion.p 
                  className="font-sans text-sm md:text-base text-primary/70 tracking-[0.4em] uppercase"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 2 }}
                >
                  Premium Vaping Goods
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
