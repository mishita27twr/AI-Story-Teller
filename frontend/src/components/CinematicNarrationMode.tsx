import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, ChevronLeft, ChevronRight, Film } from "lucide-react";
import { Scene, cleanMarkdown } from "../utils/storyParser";

interface CinematicNarrationModeProps {
  scenes: Scene[];
  theme: { primary: string; secondary: string; gradient: string; glow: string };
  motionMode: string;
  genre: string;
  onClose: () => void;
}

const KB_MOVEMENTS = [
  { x: ["0%", "-3%"], y: ["0%", "-2%"], scaleFrom: 1,    scaleTo: 1.08 },
  { x: ["0%",  "3%"], y: ["0%",  "2%"], scaleFrom: 1,    scaleTo: 1.08 },
  { x: ["-2%", "2%"], y: ["0%", "-3%"], scaleFrom: 1.04, scaleTo: 1.1  },
  { x: ["0%",  "0%"], y: ["0%", "-4%"], scaleFrom: 1,    scaleTo: 1.12 },
  { x: ["2%", "-2%"], y: ["2%", "-2%"], scaleFrom: 1.05, scaleTo: 1    },
];

const BLOB_POSITIONS = [
  { b1: "12% 18%",  b2: "88% 82%" },
  { b1: "88% 18%",  b2: "12% 82%" },
  { b1: "50% 10%",  b2: "50% 90%" },
  { b1: "82% 50%",  b2: "18% 50%" },
  { b1: "18% 80%",  b2: "82% 20%" },
];

export function CinematicNarrationMode({
  scenes,
  theme,
  motionMode,
  genre,
  onClose,
}: CinematicNarrationModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);

  const scene = scenes[currentIndex];
  const kb = KB_MOVEMENTS[currentIndex % KB_MOVEMENTS.length];
  const bp = BLOB_POSITIONS[currentIndex % BLOB_POSITIONS.length];

  const simpleMul = motionMode.toLowerCase() === "simple" ? 0.3 : 1;
  const dramaticAdd = motionMode.toLowerCase() === "dramatic" ? 0.05 : 0;
  const kbDuration =
    motionMode.toLowerCase() === "dramatic" ? 16
    : motionMode.toLowerCase() === "simple" ? 45
    : 28;

  const scaleFrom = 1 + (kb.scaleFrom - 1 + dramaticAdd) * (motionMode.toLowerCase() === "simple" ? 0.5 : 1);
  const scaleTo   = 1 + (kb.scaleTo   - 1 + dramaticAdd) * (motionMode.toLowerCase() === "simple" ? 0.5 : 1);
  const kbX = kb.x.map(v => `${parseFloat(v) * simpleMul}%`) as [string, string];
  const kbY = kb.y.map(v => `${parseFloat(v) * simpleMul}%`) as [string, string];

  useEffect(() => {
    if (!isPlaying || hasEnded) {
      window.speechSynthesis?.cancel();
      setIsNarrating(false);
      return;
    }

    const text = cleanMarkdown(scene.content);

    const doSpeak = () => {
      if (!("speechSynthesis" in window)) {
        const wordCount = text.split(/\s+/).length;
        const ms = Math.max((wordCount / 150) * 60000, 4000);
        const t = setTimeout(() => {
          if (currentIndex < scenes.length - 1) {
            setCurrentIndex(p => p + 1);
          } else {
            setHasEnded(true);
            setIsPlaying(false);
          }
        }, ms);
        return () => clearTimeout(t);
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 0.95;

      const assignVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(
          v =>
            v.name.includes("Google UK English Male") ||
            v.name.includes("Daniel") ||
            (v.lang.startsWith("en") && !v.name.toLowerCase().includes("female"))
        );
        if (preferred) utterance.voice = preferred;
      };
      assignVoice();
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = assignVoice;
      }

      utterance.onstart = () => setIsNarrating(true);
      utterance.onend = () => {
        setIsNarrating(false);
        setTimeout(() => {
          if (currentIndex < scenes.length - 1) {
            setCurrentIndex(p => p + 1);
          } else {
            setHasEnded(true);
            setIsPlaying(false);
          }
        }, 1400);
      };
      utterance.onerror = () => setIsNarrating(false);

      window.speechSynthesis.speak(utterance);
    };

    const delay = setTimeout(doSpeak, 900);

    return () => {
      clearTimeout(delay);
      window.speechSynthesis?.cancel();
      setIsNarrating(false);
    };
  }, [isPlaying, currentIndex, scene.content, scenes.length, hasEnded]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const goTo = (index: number) => {
    setCurrentIndex(index);
    setHasEnded(false);
  };

  const handlePrev = () => { if (currentIndex > 0) goTo(currentIndex - 1); };
  const handleNext = () => {
    if (currentIndex < scenes.length - 1) goTo(currentIndex + 1);
    else { setHasEnded(true); setIsPlaying(false); }
  };
  const handleRestart = () => { goTo(0); setIsPlaying(true); };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] bg-black overflow-hidden"
    >
      {/* ── Ken Burns background ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentIndex}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4 }}
        >
          <div className="absolute inset-0 bg-[#03040a]" />

          <motion.div
            className="absolute inset-[-10%] origin-center"
            initial={{ scale: scaleFrom, x: kbX[0], y: kbY[0] }}
            animate={{ scale: scaleTo,   x: kbX[1], y: kbY[1] }}
            transition={{ duration: kbDuration, ease: "linear" }}
            style={{
              background: `
                radial-gradient(ellipse 65% 65% at ${bp.b1}, ${theme.primary}55 0%, transparent 70%),
                radial-gradient(ellipse 55% 55% at ${bp.b2}, ${theme.secondary}3a 0%, transparent 70%)
              `,
            }}
          />

          <motion.div
            className="absolute w-[700px] h-[700px] rounded-full blur-[140px]"
            style={{ backgroundColor: theme.primary, opacity: 0.18, top: "5%", left: "0%" }}
            animate={{ x: [0, 40, -15, 0], y: [0, -25, 15, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full blur-[110px]"
            style={{ backgroundColor: theme.secondary, opacity: 0.14, bottom: "10%", right: "5%" }}
            animate={{ x: [0, -25, 20, 0], y: [0, 20, -25, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          />

          {/* subtle horizontal scan-line texture */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 3px)",
              backgroundSize: "100% 3px",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Cinematic letterbox vignette ── */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-black via-black/70 to-transparent z-10 pointer-events-none" />

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Film className="w-4 h-4 opacity-50" style={{ color: theme.primary }} />
          <span className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-white/50">
            {genre} · Cinematic Mode
          </span>
          <AnimatePresence>
            {isNarrating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex gap-[3px] items-end h-4"
              >
                {[0, 150, 300, 150, 0].map((delay, i) => (
                  <motion.span
                    key={i}
                    className="w-[3px] rounded-full bg-white/50"
                    animate={{ height: ["4px", "12px", "4px"] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: delay / 1000 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md border border-white/10"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* ── Scene title ── */}
      <AnimatePresence mode="wait">
        {!hasEnded && (
          <motion.div
            key={`title-${currentIndex}`}
            className="absolute top-14 left-0 right-0 flex justify-center z-20 px-8"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 0.65, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <span
              className="font-cinzel text-xs tracking-[0.4em] uppercase"
              style={{ color: theme.primary }}
            >
              {scene.title}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── THE END screen ── */}
      <AnimatePresence>
        {hasEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 z-30 flex items-center justify-center"
          >
            <div className="text-center space-y-6">
              <motion.h2
                initial={{ opacity: 0, scale: 0.85, letterSpacing: "0.6em" }}
                animate={{ opacity: 1, scale: 1, letterSpacing: "0.3em" }}
                transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
                className="font-cinzel text-5xl md:text-7xl font-bold text-white"
                style={{ textShadow: `0 0 80px ${theme.primary}, 0 0 160px ${theme.primary}55` }}
              >
                The End
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="font-serif text-lg text-white/45 italic tracking-widest"
              >
                — {genre} —
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="flex gap-4 justify-center pt-6"
              >
                <button
                  onClick={handleRestart}
                  className="px-7 py-2.5 rounded-lg font-cinzel text-xs tracking-[0.2em] uppercase text-white border border-white/20 hover:bg-white/10 transition-all"
                >
                  Replay
                </button>
                <button
                  onClick={onClose}
                  className="px-7 py-2.5 rounded-lg font-cinzel text-xs tracking-[0.2em] uppercase text-white transition-all hover:scale-105"
                  style={{ background: theme.gradient, boxShadow: theme.glow }}
                >
                  Exit
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Subtitle text ── */}
      <AnimatePresence mode="wait">
        {!hasEnded && (
          <motion.div
            key={`sub-${currentIndex}`}
            className="absolute bottom-20 left-0 right-0 z-20 px-8 md:px-20 lg:px-36"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
          >
            <p
              className="font-serif italic text-white text-center leading-relaxed max-w-4xl mx-auto"
              style={{
                fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)",
                textShadow: "0 2px 12px rgba(0,0,0,0.95), 0 0 30px rgba(0,0,0,0.8)",
              }}
            >
              {scene.content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Progress bar ── */}
      {!hasEnded && (
        <div className="absolute bottom-[68px] left-8 right-8 z-20 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: theme.gradient }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / scenes.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      {/* ── Playback controls ── */}
      {!hasEnded && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-5">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-25 disabled:cursor-not-allowed transition-all backdrop-blur-md border border-white/10"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsPlaying(p => !p)}
            className="p-4 rounded-full transition-all"
            style={{ background: theme.gradient, boxShadow: theme.glow }}
          >
            {isPlaying
              ? <Pause className="w-6 h-6 text-white" />
              : <Play  className="w-6 h-6 text-white" />
            }
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            disabled={currentIndex === scenes.length - 1}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-25 disabled:cursor-not-allowed transition-all backdrop-blur-md border border-white/10"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>

          <span className="font-cinzel text-[10px] tracking-[0.2em] text-white/40 uppercase ml-2">
            {currentIndex + 1} / {scenes.length}
          </span>
        </div>
      )}
    </motion.div>
  );
}
