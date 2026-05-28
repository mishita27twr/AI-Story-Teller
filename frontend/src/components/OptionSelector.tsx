import { motion } from "framer-motion";

interface OptionSelectorProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

export function OptionSelector({ label, options, selected, onSelect }: OptionSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-cinzel font-medium text-muted-foreground uppercase tracking-[0.2em]">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected === option;
          return (
            <motion.button
              key={option}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(option)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                isSelected 
                  ? "bg-primary text-primary-foreground border-primary glow-pulse" 
                  : "bg-secondary text-secondary-foreground border-border hover:border-primary/50 hover:bg-secondary/80"
              }`}
              style={{
                boxShadow: isSelected ? "0 0 10px rgba(139, 92, 246, 0.5)" : "none"
              }}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
