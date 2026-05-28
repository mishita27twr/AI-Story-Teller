import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Library as LibraryIcon } from "lucide-react";

export function Navbar() {
  const location = useLocation();

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Sparkles className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
          <span className="font-cinzel font-bold text-lg tracking-widest bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent group-hover:text-white transition-all glow-pulse">
            MysticFlow
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Create
          </Link>
          <Link 
            to="/library" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/library' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <LibraryIcon className="w-4 h-4" />
            Library
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
