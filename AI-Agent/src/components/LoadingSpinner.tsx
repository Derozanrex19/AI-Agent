import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export function LoadingSpinner({ className, size = 48 }: LoadingSpinnerProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      {/* Outer Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-lifewood-castleton/20"
        style={{ width: size, height: size }}
      />
      
      {/* Spinning Segment */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-t-lifewood-saffaron border-r-transparent border-b-transparent border-l-transparent"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner Pulse */}
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-lifewood-castleton"
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
