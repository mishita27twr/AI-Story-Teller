import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { SavedStories } from "../components/SavedStories";
import { getSavedStories, deleteStory, clearStories, SavedStory } from "../utils/storage";
import { Film, Sparkles } from "lucide-react";

export default function Library() {
  const navigate = useNavigate();
  const [stories, setStories] = useState<SavedStory[]>([]);

  const loadStories = () => {
    setStories(getSavedStories().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleOpen = (story: SavedStory) => {
    navigate("/result", {
      state: {
        story: story.rawText,
        genre: story.genre,
        mood: story.mood,
        style: story.style,
        length: "Medium", // Default since it's not saved explicitly
        motionMode: "Cinematic" // Default
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this story?")) {
      deleteStory(id);
      loadStories();
    }
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete ALL saved stories? This cannot be undone.")) {
      clearStories();
      loadStories();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background relative pb-24"
    >
      <Navbar />

      <main className="container mx-auto px-4 pt-12 md:pt-16 relative z-10">
        {stories.length === 0 ? (
          <div className="w-full max-w-2xl mx-auto mt-20 flex flex-col items-center justify-center text-center p-12 rounded-3xl border border-white/5 bg-card/30 backdrop-blur-sm">
            <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
              <Film className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-cinzel font-bold text-white mb-4 tracking-wide">Your vault is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              You haven't directed any stories yet. Head to the studio to create your first masterpiece.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 rounded-lg font-bold text-white flex items-center gap-2 transition-all hover:scale-105 bg-gradient-to-r from-primary to-purple-600 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              <Sparkles className="w-4 h-4" />
              Start Creating
            </button>
          </div>
        ) : (
          <SavedStories 
            stories={stories}
            onOpen={handleOpen}
            onDelete={handleDelete}
            onClearAll={handleClearAll}
          />
        )}
      </main>
    </motion.div>
  );
}
