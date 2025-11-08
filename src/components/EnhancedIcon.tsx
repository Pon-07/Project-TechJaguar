import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface EnhancedIconProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  glowColor?: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  pulse?: boolean;
  disabled?: boolean;
}

export function EnhancedIcon({ 
  icon: Icon, 
  size = 'md', 
  color = 'text-primary', 
  glowColor = 'rgb(34, 197, 94)', // Default green
  isActive = false,
  onClick,
  className = '',
  pulse = true,
  disabled = false
}: EnhancedIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const glowIntensity = isActive ? '0 0 20px' : '0 0 8px';
  const scaleActive = isActive ? 1.1 : 1;

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { 
        scale: 1.05,
        filter: `drop-shadow(${glowIntensity} ${glowColor})`
      }}
      whileTap={disabled ? {} : { 
        scale: 0.95 
      }}
      animate={disabled ? {} : {
        scale: scaleActive,
        filter: pulse ? [
          `drop-shadow(0 0 4px ${glowColor})`,
          `drop-shadow(0 0 12px ${glowColor})`,
          `drop-shadow(0 0 4px ${glowColor})`
        ] : `drop-shadow(${isActive ? glowIntensity : '0 0 4px'} ${glowColor})`
      }}
      transition={{
        scale: { duration: 0.3, ease: "easeInOut" },
        filter: pulse ? { 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        } : { duration: 0.3 }
      }}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${glowColor}20 0%, transparent 70%)`,
          filter: `blur(8px)`
        }}
        animate={pulse ? {
          opacity: [0.3, 0.8, 0.3],
          scale: [0.8, 1.2, 0.8]
        } : {
          opacity: isActive ? 0.8 : 0.3
        }}
        transition={pulse ? {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : {
          duration: 0.3
        }}
      />
      
      {/* Icon with enhanced styling */}
      <motion.div
        className="relative z-10"
        animate={{
          filter: isActive ? 
            `brightness(1.3) saturate(1.2)` : 
            `brightness(1) saturate(1)`
        }}
        transition={{ duration: 0.3 }}
      >
        <Icon 
          className={`${sizeClasses[size]} ${color} ${isActive ? 'brightness-110 saturate-150' : ''}`}
          style={{
            filter: `drop-shadow(0 0 2px ${glowColor}40)`
          }}
        />
      </motion.div>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
          style={{ backgroundColor: glowColor }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
      )}
    </motion.div>
  );
}

// Helper function to get theme color based on context
export const getThemeColor = (theme: 'farmer' | 'warehouse' | 'consumer' | 'uzhavan' | 'default' = 'default') => {
  const colors = {
    farmer: 'rgb(34, 197, 94)', // Green
    warehouse: 'rgb(251, 146, 60)', // Orange
    consumer: 'rgb(59, 130, 246)', // Blue  
    uzhavan: 'rgb(147, 51, 234)', // Purple
    default: 'rgb(34, 197, 94)' // Default green
  };
  return colors[theme];
};