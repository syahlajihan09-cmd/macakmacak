import React from 'react';
import { CustomerMood, CustomerPersonalityType } from '../types/game';
import { motion } from 'motion/react';

export interface CustomerAvatarProps {
  personality: CustomerPersonalityType;
  mood: CustomerMood;
  elapsedWaitTime: number;
  size?: 'sm' | 'md' | 'lg';
}

export const CustomerAvatar: React.FC<CustomerAvatarProps> = ({
  personality,
  mood,
  elapsedWaitTime,
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  const isAngry = elapsedWaitTime > 20 && mood !== 'served';
  const isBored = elapsedWaitTime > 10 && elapsedWaitTime <= 20 && mood !== 'served';
  const isServed = mood === 'served';
  const isLeaving = mood === 'leaving';

  // Hair color and clothes based on personality
  const getPersonaTheme = () => {
    switch (personality) {
      case 'kid':
        return { shirt: '#38BDF8', hair: '#F59E0B', hat: 'cap' };
      case 'vip':
        return { shirt: '#8B5CF6', hair: '#1E293B', hat: 'crown' };
      case 'foodie':
        return { shirt: '#F43F5E', hair: '#D97706', hat: 'beret' };
      case 'impatient':
        return { shirt: '#F97316', hair: '#475569', hat: 'none' };
      case 'family':
        return { shirt: '#10B981', hair: '#78350F', hat: 'none' };
      case 'ceria':
      default:
        return { shirt: '#EC4899', hair: '#B45309', hat: 'ribbon' };
    }
  };

  const theme = getPersonaTheme();

  return (
    <motion.div
      className={`relative ${sizeMap[size]} flex items-center justify-center select-none`}
      animate={
        isServed
          ? { y: [0, -6, 0], rotate: [0, -5, 5, 0] }
          : isAngry
          ? { x: [-2, 2, -2, 2, 0], scale: [1, 1.05, 1] }
          : isBored
          ? { rotate: [-3, 0, 3, 0] }
          : { y: [0, -2, 0] }
      }
      transition={{
        repeat: Infinity,
        duration: isAngry ? 0.2 : isServed ? 0.8 : isBored ? 1.8 : 2.0,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shirt / Shoulders */}
        <path
          d="M 22 75 C 22 64, 78 64, 78 75 L 84 100 L 16 100 Z"
          fill={isAngry ? '#E11D48' : theme.shirt}
          stroke="#3E2723"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Neck */}
        <rect x="42" y="58" width="16" height="12" rx="3" fill="#FED7AA" stroke="#3E2723" strokeWidth="2.5" />

        {/* Ears */}
        <circle cx="28" cy="48" r="5" fill="#FED7AA" stroke="#3E2723" strokeWidth="2" />
        <circle cx="72" cy="48" r="5" fill="#FED7AA" stroke="#3E2723" strokeWidth="2" />

        {/* Head Base */}
        <ellipse
          cx="50"
          cy="48"
          rx="22"
          ry="21"
          fill={isAngry ? '#FECDD3' : '#FFEDD5'}
          stroke="#3E2723"
          strokeWidth="3"
        />

        {/* Hair Styles */}
        <path
          d="M 28 42 C 28 26, 72 26, 72 42 C 68 34, 52 32, 50 36 C 48 32, 32 34, 28 42 Z"
          fill={theme.hair}
        />

        {/* Hats / Accessories */}
        {theme.hat === 'crown' && (
          <path
            d="M 38 28 L 42 16 L 50 24 L 58 16 L 62 28 Z"
            fill="#FBBF24"
            stroke="#B45309"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        )}
        {theme.hat === 'cap' && (
          <g>
            <path d="M 32 32 Q 50 20 68 32 Z" fill="#0284C7" stroke="#3E2723" strokeWidth="2" />
            <path d="M 64 32 L 80 34 L 64 36 Z" fill="#0369A1" stroke="#3E2723" strokeWidth="1.5" />
          </g>
        )}
        {theme.hat === 'ribbon' && (
          <circle cx="68" cy="30" r="4" fill="#F43F5E" stroke="#9F1239" strokeWidth="1.5" />
        )}

        {/* Cheeks */}
        <ellipse cx="36" cy="54" rx="4" ry="3" fill={isAngry ? '#E11D48' : '#FB7185'} fillOpacity={isAngry ? 0.6 : 0.4} />
        <ellipse cx="64" cy="54" rx="4" ry="3" fill={isAngry ? '#E11D48' : '#FB7185'} fillOpacity={isAngry ? 0.6 : 0.4} />

        {/* Eyes & Expressions */}
        {isServed ? (
          // Starry / Heart Happy Eyes
          <>
            <path d="M 37 46 Q 42 42 47 46" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />
            <path d="M 53 46 Q 58 42 63 46" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : isAngry ? (
          // Angry eyes & heavy slanted eyebrows
          <>
            <ellipse cx="42" cy="48" rx="3.5" ry="3.5" fill="#3E2723" />
            <ellipse cx="58" cy="48" rx="3.5" ry="3.5" fill="#3E2723" />
            <path d="M 36 41 L 46 45" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" />
            <path d="M 64 41 L 54 45" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : isBored ? (
          // Bored half-lidded eyes
          <>
            <path d="M 38 48 H 46" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />
            <path d="M 54 48 H 62" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />
            <path d="M 38 43 Q 42 45 46 44" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
            <path d="M 54 44 Q 58 45 62 43" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          // Cheerful big eyes
          <>
            <circle cx="42" cy="48" r="3.5" fill="#3E2723" />
            <circle cx="41" cy="46.5" r="1.2" fill="#FFFFFF" />
            <circle cx="58" cy="48" r="3.5" fill="#3E2723" />
            <circle cx="57" cy="46.5" r="1.2" fill="#FFFFFF" />
            <path d="M 38 43 Q 42 41 46 43" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
            <path d="M 54 43 Q 58 41 62 43" stroke="#3E2723" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {/* Mouths */}
        {isServed ? (
          <path d="M 43 56 Q 50 64 57 56 Z" fill="#EF4444" stroke="#3E2723" strokeWidth="2" />
        ) : isAngry ? (
          // Wavy angry mouth or teeth clenched
          <path d="M 42 58 Q 50 52 58 58" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" />
        ) : isBored ? (
          // Straight neutral line
          <line x1="44" y1="56" x2="56" y2="56" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
        ) : (
          // Cheerful open smile
          <path d="M 44 55 Q 50 61 56 55" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
        )}

        {/* Steam fumes if angry */}
        {isAngry && (
          <g>
            <path d="M 24 38 Q 20 34 24 30" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 76 38 Q 80 34 76 30" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </motion.div>
  );
};
