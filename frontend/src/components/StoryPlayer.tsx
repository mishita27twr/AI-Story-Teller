import { useState, useEffect } from "react";
import { Scene } from "../utils/storyParser";
import { SceneCard } from "./SceneCard";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Download, Copy, Bookmark, Check, RotateCcw, Clapperboard } from "lucide-react";
import { playNarration } from "../services/narrationApi";
import { motion, AnimatePresence } from "framer-motion";
import { CinematicNarrationMode } from "./CinematicNarrationMode";

interface StoryPlayerProps {
  scenes: Scene[];
  rawText: string;
  genre: string;
  theme: { primary: string; secondary: string; gradient: string; glow: string };
  motionMode: string;
  onSave: () => void;
  isSaved: boolean;
}

export function StoryPlayer({ scenes, rawText, genre, theme, motionMode, onSave, isSaved }: StoryPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCinematicMode, setIsCinematicMode] = useState(false);

  const handleNext = () => {
    if (currentIndex < scenes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const toggleSpeech = async () => {

  if (isSpeaking) {
    setIsSpeaking(false);
    return;
  }

  try {

    setIsSpeaking(true);

    await playNarration(
      scenes[currentIndex],
      genre
    );

  } catch (error) {

    console.log(error);

  } finally {

    setIsSpeaking(false);

  }
};

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([rawText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `story-${genre.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const progress = ((currentIndex + 1) / scenes.length) * 100;

  const handleOpenCinematic = () => {
  setIsSpeaking(false);
  setIsCinematicMode(true);
};

  return (
    <div className="w-full flex flex-col items-center">
      {/* Progress bar */}
      <div className="w-full max-w-4xl h-1 bg-secondary rounded-full overflow-hidden mb-8">
        <motion.div 
          className="h-full"
          style={{ background: theme.gradient }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main viewer */}
      <div className="w-full relative">
        <SceneCard 
          scene={scenes[currentIndex]} 
          theme={theme}
          isActive={true}
          motionMode={motionMode}
        />
        
        {/* Navigation arrows (desktop) */}
        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-full justify-between px-4 -mx-16 box-content z-10 pointer-events-none">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white backdrop-blur-md pointer-events-auto transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={handleNext}
            disabled={currentIndex === scenes.length - 1}
            className="w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white backdrop-blur-md pointer-events-auto transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Controls row */}
      <div className="w-full max-w-4xl mt-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-card border border-white/5 rounded-2xl p-4 md:p-6 backdrop-blur-sm">
        
        {/* Scene counter and nav for mobile */}
        <div className="flex items-center gap-4">
          <button onClick={handlePrev} disabled={currentIndex === 0} className="md:hidden p-2 text-muted-foreground disabled:opacity-30">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="font-cinzel text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            Scene {currentIndex + 1} <span className="opacity-50">/</span> {scenes.length}
          </div>
          <button onClick={handleNext} disabled={currentIndex === scenes.length - 1} className="md:hidden p-2 text-muted-foreground disabled:opacity-30">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setCurrentIndex(0)}
            className="p-2.5 rounded-lg bg-secondary/50 text-muted-foreground hover:text-white hover:bg-secondary transition-all group"
            title="Restart"
          >
            <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform duration-500" />
          </button>
          
          <button
            onClick={toggleSpeech}
            className={`p-2.5 rounded-lg transition-all flex items-center gap-2 ${isSpeaking ? 'text-white' : 'text-muted-foreground hover:text-white hover:bg-secondary bg-secondary/50'}`}
            style={{ 
              background: isSpeaking ? theme.primary : undefined,
              boxShadow: isSpeaking ? theme.glow : 'none'
            }}
            title="Narrate"
          >
            {isSpeaking ? (
              <>
                <Volume2 className="w-5 h-5" />
                <span className="flex gap-1 h-3 items-center">
                  <span className="w-1 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </>
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>

          <div className="h-8 w-px bg-white/10 mx-2" />

          <button onClick={handleCopy} className="p-2.5 rounded-lg bg-secondary/50 text-muted-foreground hover:text-white hover:bg-secondary transition-all" title="Copy text">
            {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
          </button>

          <button onClick={handleDownload} className="p-2.5 rounded-lg bg-secondary/50 text-muted-foreground hover:text-white hover:bg-secondary transition-all" title="Download TXT">
            <Download className="w-5 h-5" />
          </button>

          <button 
            onClick={onSave}
            disabled={isSaved}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${isSaved ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'text-white hover:scale-105'}`}
            style={{ 
              background: !isSaved ? theme.gradient : undefined,
              boxShadow: !isSaved ? theme.glow : 'none'
            }}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save Story'}</span>
          </button>
        </div>
      </div>

      {/* Cinematic Mode entry button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleOpenCinematic}
        className="mt-6 w-full max-w-4xl flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-white/10 bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-all group relative overflow-hidden"
        style={{ boxShadow: `0 0 40px ${theme.primary}22` }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${theme.primary}18 0%, transparent 60%)` }}
        />
        <Clapperboard className="w-5 h-5 transition-colors" style={{ color: theme.primary }} />
        <div className="text-left">
          <p className="font-cinzel text-sm tracking-[0.15em] uppercase text-white group-hover:text-white transition-colors">
            Cinematic Narration Mode
          </p>
          <p className="font-sans text-xs text-muted-foreground mt-0.5">
            Full-screen motion experience with auto voice narration
          </p>
        </div>
        <div className="ml-auto flex gap-1 items-end h-5 opacity-50">
          {[0, 150, 300, 150, 0].map((delay, i) => (
            <span
              key={i}
              className="w-1 rounded-full animate-pulse"
              style={{
                backgroundColor: theme.primary,
                height: `${[8, 14, 20, 14, 8][i]}px`,
                animationDelay: `${delay}ms`,
              }}
            />
          ))}
        </div>
      </motion.button>

      {/* Cinematic overlay */}
      <AnimatePresence>
        {isCinematicMode && (
          <CinematicNarrationMode
            scenes={scenes}
            theme={theme}
            motionMode={motionMode}
            genre={genre}
            onClose={() => setIsCinematicMode(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
