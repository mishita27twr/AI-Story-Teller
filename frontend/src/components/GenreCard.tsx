import { motion } from "framer-motion";
import { Heart, HeartCrack, Skull, Eye, Zap, Laugh, Sparkles, Film } from "lucide-react";

interface GenreCardProps {
  genre: string;
  isSelected: boolean;
  theme: { primary: string; secondary: string; gradient: string; glow: string };
  onClick: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  "Romance": Heart,
  "Dark Romance": HeartCrack,
  "Horror": Skull,
  "Thriller": Eye,
  "Action": Zap,
  "Comedy": Laugh,
  "Fantasy": Sparkles,
  "Drama": Film
};

export function GenreCard({ genre, isSelected, theme, onClick }: GenreCardProps) {
  const Icon = iconMap[genre] || Sparkles;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative w-full h-32 rounded-xl flex flex-col items-center justify-center gap-3 transition-all overflow-hidden border ${
        isSelected 
          ? "border-transparent bg-black/50 text-white" 
          : "border-white/10 bg-card text-muted-foreground hover:bg-white/5 hover:text-white"
      }`}
      style={{
        boxShadow: isSelected ? theme.glow : 'none',
      }}
    >
      {isSelected && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{ background: theme.gradient }}
        />
      )}
      
      <Icon 
        className="w-8 h-8 z-10 transition-colors" 
        style={{ color: isSelected ? theme.primary : 'currentColor' }} 
      />
      <span className="font-cinzel text-sm font-semibold tracking-[0.12em] z-10">{genre}</span>
      
      {isSelected && (
        <motion.div 
          layoutId="genre-border"
          className="absolute inset-0 rounded-xl border-2 pointer-events-none"
          style={{ borderColor: theme.primary }}
        />
      )}
    </motion.button>
  );
}
