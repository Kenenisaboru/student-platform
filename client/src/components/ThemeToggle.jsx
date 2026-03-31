import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl transition-all duration-300 relative group text-slate-500 hover:text-blue-400 hover:bg-white/[0.04]"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: isDarkMode ? 180 : 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
                {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                ) : (
                    <Moon className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                )}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
