import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { examplePrompts } from "../data/storyOptions";

interface StoryFormProps {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
  theme: { primary: string; secondary: string; gradient: string; glow: string } | null;
}

export function StoryForm({ onSubmit, isLoading, theme }: StoryFormProps) {
  const [idea, setIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) {
      onSubmit(idea);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your story idea... (e.g., A time traveler who goes back to save their past self, but realizes they are the villain)"
            className="w-full h-40 p-6 rounded-xl bg-card border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 resize-none transition-all"
            style={{
              "--tw-ring-color": theme ? theme.primary : "var(--primary)",
            } as any}
          />
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!idea.trim() || isLoading}
            className="absolute bottom-4 right-4 px-6 py-2.5 rounded-lg font-bold text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              background: theme ? theme.gradient : "var(--primary)",
              boxShadow: idea.trim() && theme ? theme.glow : "none"
            }}
          >
            {isLoading ? "Action!" : "Generate Story"}
            <Sparkles className="w-4 h-4" />
          </motion.button>
        </div>
      </form>

      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Or start with inspiration:</p>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setIdea(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-white/5 hover:border-white/20 hover:bg-white/5 transition-colors text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
