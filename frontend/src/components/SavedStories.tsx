import { motion } from "framer-motion";
import { SavedStory } from "../utils/storage";
import { Trash2, ExternalLink, Calendar, Film } from "lucide-react";
import { genreThemes } from "../data/storyOptions";

interface SavedStoriesProps {
  stories: SavedStory[];
  onOpen: (story: SavedStory) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function SavedStories({ stories, onOpen, onDelete, onClearAll }: SavedStoriesProps) {
  if (stories.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-serif">Your Collection</h2>
        <button 
          onClick={onClearAll}
          className="text-sm text-destructive hover:text-destructive/80 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story, i) => {
          const theme = genreThemes[story.genre] || genreThemes["Drama"];
          const date = new Date(story.date).toLocaleDateString(undefined, { 
            year: 'numeric', month: 'short', day: 'numeric' 
          });

          return (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-card border border-white/5 hover:border-white/20 rounded-xl p-6 transition-all hover:shadow-2xl overflow-hidden flex flex-col h-full"
              style={{
                '--hover-glow': theme.glow
              } as any}
            >
              {/* Hover effect background */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"
                style={{ background: theme.gradient }}
              />

              <div className="flex items-start justify-between mb-4">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                  style={{ 
                    borderColor: theme.primary, 
                    color: theme.primary,
                    backgroundColor: `${theme.primary}10` 
                  }}
                >
                  {story.genre}
                </span>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(story.id); }}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  title="Delete story"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl font-serif font-bold text-white mb-2 line-clamp-2 leading-tight">
                {story.title}
              </h3>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-6 font-mono">
                <span className="flex items-center gap-1.5"><Film className="w-3 h-3" /> {story.style} • {story.mood}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 font-mono">
                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {date}</span>
              </div>

              <button
                onClick={() => onOpen(story)}
                className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all hover:scale-110"
                style={{ background: theme.primary, boxShadow: theme.glow }}
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
