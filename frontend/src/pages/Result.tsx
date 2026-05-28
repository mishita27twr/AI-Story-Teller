import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { StoryPlayer } from "../components/StoryPlayer";
import { genreThemes } from "../data/storyOptions";
import { parseStoryIntoScenes, Scene } from "../utils/storyParser";
import { saveStory, SavedStory } from "../utils/storage";
import { ArrowLeft } from "lucide-react";

interface ResultState {
  story: string;
  genre: string;
  mood: string;
  style: string;
  length: string;
  motionMode: string;
}

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultState | null;

  const [isSaved, setIsSaved] = useState(false);

  // Parse scenes only once
  const scenes = useMemo<Scene[]>(() => {
    if (!state?.story) return [];
    return parseStoryIntoScenes(state.story).map(scene => ({
      ...scene,
      mood: state.mood
    }));
  }, [state?.story, state?.mood]);

  if (!state || !state.story) {
    return <Navigate to="/" replace />;
  }

  const theme = genreThemes[state.genre] || genreThemes["Drama"];

  const handleSave = () => {
    if (isSaved) return;

    // Create a title from the first scene or first few words
    let title = scenes.length > 0 ? scenes[0].content.substring(0, 50).trim() : state.story.substring(0, 50).trim();
    if (title.length >= 50) title += "...";
    if (!title) title = `Untitled ${state.genre} Story`;

    const newStory: SavedStory = {
      id: Date.now().toString(),
      title,
      genre: state.genre,
      mood: state.mood,
      style: state.style,
      rawText: state.story,
      date: new Date().toISOString()
    };

    saveStory(newStory);
    setIsSaved(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background relative flex flex-col"
    >
      <Navbar />

      {/* Cinematic background */}
      <div className="fixed inset-0 pointer-events-none opacity-10 transition-all duration-1000 z-0"
           style={{
             background: `linear-gradient(to bottom, transparent, ${theme.primary}20), radial-gradient(circle at center, transparent 30%, black 100%)`
           }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.apply/noise.svg')] opacity-[0.03] z-0" />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10 flex flex-col">
        
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Studio
          </button>
          
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 bg-black/50 text-white backdrop-blur-sm">
              {state.genre}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 bg-black/50 text-white backdrop-blur-sm">
              {state.style}
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <StoryPlayer 
            scenes={scenes}
            rawText={state.story}
            genre={state.genre}
            theme={theme}
            motionMode={state.motionMode}
            onSave={handleSave}
            isSaved={isSaved}
          />
        </div>
        
      </main>
    </motion.div>
  );
}
