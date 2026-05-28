import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

interface LoadingScreenProps {
  isVisible: boolean;
  genre: string;
  theme: { primary: string; secondary: string; gradient: string; glow: string } | null;
}

export function LoadingScreen({ isVisible, genre, theme }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl overflow-hidden"
        >
          {/* Animated background effects */}
          {theme && (
            <>
              <div 
                className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full blur-[128px] opacity-30 blob"
                style={{ backgroundColor: theme.primary }}
              />
              <div 
                className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[128px] opacity-20 blob blob-delay-2"
                style={{ backgroundColor: theme.secondary }}
              />
            </>
          )}
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-md px-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 rounded-full border-t-2 border-r-2 animate-spin"
              style={{ borderColor: theme?.primary || 'var(--primary)' }}
            />
            
            <div className="space-y-4">
              <h2 className="text-2xl font-cinzel font-bold tracking-[0.3em] uppercase" style={{ color: theme?.primary || 'white', textShadow: theme?.glow || 'none' }}>
                Director's Cut
              </h2>
              
              <div className="h-8 text-muted-foreground font-sans text-sm tracking-wider">
                <TypeAnimation
                  sequence={[
                    "Setting the stage...", 1500,
                    `Crafting a ${genre} masterpiece...`, 2000,
                    "Writing dialogue...", 1500,
                    "Adding dramatic tension...", 1500,
                    "Finalizing the script...", 1500,
                  ]}
                  wrapper="span"
                  cursor={true}
                  repeat={Infinity}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
