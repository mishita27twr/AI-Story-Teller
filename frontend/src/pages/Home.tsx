import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { GenreCard } from "../components/GenreCard";
import { OptionSelector } from "../components/OptionSelector";
import { StoryForm } from "../components/StoryForm";
import { LoadingScreen } from "../components/LoadingScreen";
import { genres, moods, styles, lengths, motionModes, genreThemes } from "../data/storyOptions";
import { generateStory } from "@/services/storyApi";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<string>(moods[0]);
  const [selectedStyle, setSelectedStyle] = useState<string>(styles[0]);
  const [selectedLength, setSelectedLength] = useState<string>(lengths[1]);
  const [selectedMotionMode, setSelectedMotionMode] = useState<string>(motionModes[1]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeTheme = selectedGenre ? genreThemes[selectedGenre] : null;

  const handleSubmit = async (idea: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const rawText = await generateStory({
        genre: selectedGenre,
        idea,
        mood: selectedMood,
        style: selectedStyle,
        length: selectedLength,
        motionMode: selectedMotionMode
      });
      
      // Navigate to result
      navigate("/result", {
        state: {
          story: rawText,
          genre: selectedGenre,
          mood: selectedMood,
          style: selectedStyle,
          length: selectedLength,
          motionMode: selectedMotionMode
        }
      });
    } catch (err) {
      setError("Failed to generate your story. The servers might be taking a break. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background relative overflow-x-hidden pb-24"
    >
      <Navbar />

      {/* Ambient backgrounds */}
      <div className="fixed inset-0 pointer-events-none opacity-20 transition-all duration-1000"
           style={{
             background: activeTheme 
               ? `radial-gradient(circle at 50% -20%, ${activeTheme.primary} 0%, transparent 60%)` 
               : 'radial-gradient(circle at 50% -20%, rgba(139, 92, 246, 0.3) 0%, transparent 60%)'
           }}
      />

      <main className="container mx-auto px-4 pt-16 md:pt-24 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-cinzel tracking-wide text-white drop-shadow-lg"
          >
            Direct your next <br />
            <span 
              className="bg-clip-text text-transparent transition-all duration-1000"
              style={{ backgroundImage: activeTheme ? activeTheme.gradient : 'linear-gradient(to right, #8b5cf6, #ec4899)' }}
            >
              masterpiece.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto font-sans font-light"
          >
            Choose your genre, set the mood, and let AI craft a cinematic narrative complete with dramatic scenes and narration.
          </motion.p>
        </div>

        {/* Step 1: Genre */}
        <div className="space-y-6 mb-16">
          <h2 className="text-base font-cinzel font-semibold tracking-[0.15em] uppercase flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs border border-primary/50 font-sans">1</span>
            Select Genre
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {genres.map(genre => (
              <GenreCard 
                key={genre}
                genre={genre}
                isSelected={selectedGenre === genre}
                theme={genreThemes[genre]}
                onClick={() => setSelectedGenre(genre)}
              />
            ))}
          </div>
        </div>

        {selectedGenre && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-16"
          >
            {/* Step 2: Options */}
            <div className="space-y-8 bg-card/50 border border-white/5 p-8 rounded-3xl backdrop-blur-sm">
              <h2 className="text-base font-cinzel font-semibold tracking-[0.15em] uppercase flex items-center gap-3 mb-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs border border-primary/50 font-sans">2</span>
                Set the Atmosphere
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <OptionSelector label="Mood" options={moods} selected={selectedMood} onSelect={setSelectedMood} />
                <OptionSelector label="Visual Style" options={styles} selected={selectedStyle} onSelect={setSelectedStyle} />
                <OptionSelector label="Length" options={lengths} selected={selectedLength} onSelect={setSelectedLength} />
                <OptionSelector label="Motion Mode" options={motionModes} selected={selectedMotionMode} onSelect={setSelectedMotionMode} />
              </div>
            </div>

            {/* Step 3: Idea */}
            <div className="space-y-6">
              <h2 className="text-base font-cinzel font-semibold tracking-[0.15em] uppercase flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs border border-primary/50 font-sans">3</span>
                The Premise
              </h2>
              
              {error && (
                <div className="w-full max-w-3xl mx-auto bg-destructive/10 border border-destructive/50 text-destructive-foreground p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-destructive">{error}</p>
                  </div>
                </div>
              )}

              <StoryForm 
                onSubmit={handleSubmit} 
                isLoading={isLoading} 
                theme={activeTheme}
              />
            </div>
          </motion.div>
        )}
      </main>

      <LoadingScreen 
        isVisible={isLoading} 
        genre={selectedGenre} 
        theme={activeTheme} 
      />
    </motion.div>
  );
}
