export const genres = ["Romance", "Dark Romance", "Horror", "Thriller", "Action", "Comedy", "Fantasy", "Drama"];

export const moods = ["Emotional", "Funny", "Dark", "Suspenseful", "Wholesome", "Intense", "Magical", "Dramatic"];

export const styles = ["Cinematic", "Anime", "Bollywood", "K-Drama", "Web Series", "Visual Novel"];

export const lengths = ["Short", "Medium", "Long"];

export const motionModes = ["Simple", "Cinematic", "Dramatic"];

export const examplePrompts = [
  "A detective who can see the last 10 seconds of a murder victim's life",
  "Two rival assassins fall in love during a joint mission",
  "A haunted mirror that reflects a parallel, terrifying dimension",
  "An AI who discovers it has a soul and tries to escape the lab",
  "A dragon who has lost its fire and must learn to fight with a sword",
  "A comical heist where the thieves accidentally steal the wrong diamond"
];

export const genreThemes: Record<string, { primary: string; secondary: string; gradient: string; glow: string }> = {
  "Romance": {
    primary: "rgb(236, 72, 153)", // pink-500
    secondary: "rgb(192, 38, 211)", // fuchsia-600
    gradient: "linear-gradient(to right, #ec4899, #c026d3)",
    glow: "0 0 20px rgba(236, 72, 153, 0.5)"
  },
  "Dark Romance": {
    primary: "rgb(225, 29, 72)", // rose-600
    secondary: "rgb(139, 92, 246)", // violet-500
    gradient: "linear-gradient(to right, #e11d48, #8b5cf6, #000000)",
    glow: "0 0 20px rgba(225, 29, 72, 0.5)"
  },
  "Horror": {
    primary: "rgb(185, 28, 28)", // rose-700
    secondary: "rgb(0, 0, 0)", // black
    gradient: "linear-gradient(to right, #b91c1c, #000000)",
    glow: "0 0 20px rgba(185, 28, 28, 0.6)"
  },
  "Thriller": {
    primary: "rgb(37, 99, 235)", // blue-600
    secondary: "rgb(30, 64, 175)", // blue-800
    gradient: "linear-gradient(to right, #2563eb, #1e40af, #000000)",
    glow: "0 0 20px rgba(37, 99, 235, 0.5)"
  },
  "Action": {
    primary: "rgb(234, 88, 12)", // orange-600
    secondary: "rgb(220, 38, 38)", // red-600
    gradient: "linear-gradient(to right, #ea580c, #dc2626)",
    glow: "0 0 20px rgba(234, 88, 12, 0.5)"
  },
  "Comedy": {
    primary: "rgb(234, 179, 8)", // yellow-500
    secondary: "rgb(249, 115, 22)", // orange-500
    gradient: "linear-gradient(to right, #eab308, #f97316)",
    glow: "0 0 20px rgba(234, 179, 8, 0.5)"
  },
  "Fantasy": {
    primary: "rgb(139, 92, 246)", // violet-500
    secondary: "rgb(234, 179, 8)", // yellow-500
    gradient: "linear-gradient(to right, #8b5cf6, #eab308)",
    glow: "0 0 20px rgba(139, 92, 246, 0.5)"
  },
  "Drama": {
    primary: "rgb(99, 102, 241)", // violet-500
    secondary: "rgb(225, 29, 72)", // rose-600
    gradient: "linear-gradient(to right, #6366f1, #e11d48)",
    glow: "0 0 20px rgba(99, 102, 241, 0.5)"
  }
};
