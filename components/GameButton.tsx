'use client';

import { motion } from 'framer-motion';

interface GameButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'success' | 'danger' | 'default';
  disabled?: boolean;
  className?: string;
  animated?: boolean;
}

export default function GameButton({
  children,
  onClick,
  variant = 'default',
  disabled = false,
  className = '',
  animated = true
}: GameButtonProps) {
  const baseClasses = 'px-6 py-4 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl',
    success: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg hover:shadow-xl',
    danger: 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-lg hover:shadow-xl',
    default: 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg hover:shadow-xl'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}

