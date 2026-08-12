import React from 'react';
import { motion } from 'motion/react';

interface ConnectingThreadProps {
  variant?: 'static' | 'animated';
  className?: string;
  label?: string;
}

/**
  A subtle suspension bridge cable line that visually represents the Bridge concept.
  Used exclusively at key connection moments:
  1. Match Found in mentor cards
  2. Session Confirmed
  3. AI Digest Generation (Animated signature delight moment)
*/
export const ConnectingThread: React.FC<ConnectingThreadProps> = ({
  variant = 'static',
  className = '',
  label,
}) => {
  return (
    <div className={`relative flex items-center justify-center my-3 w-full ${className}`}>
      <svg
        className="w-full h-7 overflow-visible"
        viewBox="0 0 400 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Anchor point left */}
        <circle cx="10" cy="15" r="3.5" fill="#3D5A80" />
        
        {/* Anchor point right */}
        <circle cx="390" cy="15" r="3.5" fill="#3D5A80" />

        {/* Subtle guide line */}
        <path
          d="M 10 15 Q 200 28 390 15"
          stroke="#E4E7EB"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          fill="none"
        />

        {/* Primary Suspension Cable */}
        {variant === 'animated' ? (
          <motion.path
            d="M 10 15 Q 200 28 390 15"
            stroke="#3D5A80"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        ) : (
          <path
            d="M 10 15 Q 200 28 390 15"
            stroke="#3D5A80"
            strokeWidth="1.75"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
        )}

        {/* Center node indicator */}
        <circle cx="200" cy="21.5" r="3" fill="#B08D57" />
      </svg>

      {label && (
        <span className="absolute -top-1 px-2.5 py-0.5 rounded-full bg-paper border border-mist text-[10px] font-mono font-medium text-ink-muted shadow-2xs">
          {label}
        </span>
      )}
    </div>
  );
};
