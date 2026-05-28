import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Scene } from "../utils/storyParser";
import { useEffect, useState } from "react";

interface SceneCardProps {
  scene: Scene;
  theme: { primary: string; secondary: string; gradient: string; glow: string };
  isActive: boolean;
  motionMode: string;
}

export function SceneCard({ scene, theme, isActive, motionMode }: SceneCardProps) {
  const [key, setKey] = useState(Date.now());
  
  // Re-mount type animation when scene changes
  useEffect(() => {
    setKey(Date.now());
  }, [scene.id]);

  const getVariants = () => {
    switch (motionMode.toLowerCase()) {
      case "simple":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: 0.4 } },
          exit: { opacity: 0, transition: { duration: 0.2 } }
        };
      case "dramatic":
        return {
          initial: { opacity: 0, scale: 0.9, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
          exit: { opacity: 0, scale: 1.1, transition: { duration: 0.5 } }
        };
      case "cinematic":
      default:
        return {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "circOut" } },
          exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
        };
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={scene.id}
          variants={getVariants()}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full max-w-4xl mx-auto h-[60vh] flex flex-col items-center justify-center p-8 md:p-16 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ background: `radial-gradient(circle at center, ${theme.primary} 0%, transparent 70%)` }}
          />

          <h3 
            className="text-base md:text-lg font-cinzel uppercase tracking-[0.25em] mb-8 text-center opacity-90"
            style={{ color: theme.primary }}
          >
            {scene.title}
          </h3>

          <div className="flex-1 w-full overflow-y-auto pr-4 scrollbar-thin flex flex-col justify-center">
            <div className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-center font-serif font-light italic text-white/95 max-w-3xl mx-auto drop-shadow-md">
              {motionMode.toLowerCase() !== 'simple' ? (
                <TypeAnimation
                  key={key}
                  sequence={[scene.content]}
                  wrapper="p"
                  cursor={false}
                  speed={85}
                  className="whitespace-pre-wrap"
                />
              ) : (
                <p className="whitespace-pre-wrap">{scene.content}</p>
              )}
            </div>
          </div>
          
          {scene.mood && (
            <div className="mt-8 px-4 py-1 rounded-full border border-white/20 text-xs font-cinzel text-muted-foreground uppercase tracking-widest">
              {scene.mood}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
