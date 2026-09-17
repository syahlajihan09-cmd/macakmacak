import React from 'react';
import { motion } from 'motion/react';

export interface ChefAvatarProps {
  chefId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  pose?: 'idle' | 'cooking' | 'happy' | 'urgent';
  showAnimation?: boolean;
}

export const ChefAvatar: React.FC<ChefAvatarProps> = ({
  chefId,
  size = 'md',
  pose = 'idle',
  showAnimation = true,
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-28 h-28',
    xl: 'w-44 h-44',
  };

  const getChefDetails = () => {
    switch (chefId) {
      case 'chef-raka':
        return {
          name: 'Chef Raka',
          themeColor: '#EF4444',
          apronColor: '#DC2626',
          bandanaColor: '#F59E0B',
          headwear: 'bandana',
          tool: 'spatula',
          eyebrows: 'tilt',
        };
      case 'chef-hana':
        return {
          name: 'Chef Hana',
          themeColor: '#EC4899',
          apronColor: '#F472B6',
          accessoryColor: '#F43F5E',
          headwear: 'flower',
          tool: 'notepad',
          eyebrows: 'soft',
        };
      case 'chef-dimas':
        return {
          name: 'Chef Dimas',
          themeColor: '#3B82F6',
          apronColor: '#1E3A8A',
          accessoryColor: '#F97316',
          headwear: 'cap',
          tool: 'tongs',
          eyebrows: 'thick',
        };
      case 'chef-naya':
        return {
          name: 'Chef Naya',
          themeColor: '#10B981',
          apronColor: '#059669',
          accessoryColor: '#F59E0B',
          headwear: 'beret',
          tool: 'whisk',
          eyebrows: 'winking',
        };
      case 'chef-mia':
      default:
        return {
          name: 'Chef Mia',
          themeColor: '#F59E0B',
          apronColor: '#FBBF24',
          accessoryColor: '#FB7185',
          headwear: 'toque',
          tool: 'spatula',
          eyebrows: 'happy',
        };
    }
  };

  const chef = getChefDetails();

  return (
    <motion.div
      className={`relative ${sizeMap[size]} flex items-center justify-center select-none`}
      animate={
        showAnimation
          ? pose === 'cooking'
            ? { y: [0, -3, 0], rotate: [-2, 2, -2] }
            : pose === 'happy'
            ? { y: [0, -6, 0], scale: [1, 1.05, 1] }
            : pose === 'urgent'
            ? { x: [-2, 2, -2] }
            : { y: [0, -2, 0] } // idle breathing
          : {}
      }
      transition={{
        repeat: Infinity,
        duration: pose === 'cooking' ? 0.6 : pose === 'urgent' ? 0.25 : 2.2,
        ease: 'easeInOut',
      }}
    >
      <svg
        viewBox="0 0 120 130"
        className="w-full h-full drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow underneath */}
        <ellipse cx="60" cy="122" rx="34" ry="7" fill="#000000" fillOpacity="0.18" />

        {/* Body / Torso & Chef Jacket */}
        <path
          d="M 32 86 C 32 76, 88 76, 88 86 L 94 120 C 94 123, 26 123, 26 120 Z"
          fill="#FFFDF9"
          stroke="#3E2723"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Chef Apron overlay */}
        <path
          d="M 40 88 L 80 88 L 86 122 L 34 122 Z"
          fill={chef.apronColor}
          fillOpacity="0.9"
          stroke="#3E2723"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Apron Pocket & Detail */}
        <rect
          x="48"
          y="102"
          width="24"
          height="14"
          rx="3"
          fill="#FFFDF9"
          stroke="#3E2723"
          strokeWidth="2"
        />
        {/* Apron Buttons */}
        <circle cx="54" cy="94" r="2" fill="#3E2723" />
        <circle cx="66" cy="94" r="2" fill="#3E2723" />

        {/* Red / Accent Scarf / Bow Tie */}
        {chefId === 'chef-mia' && (
          <path
            d="M 52 82 Q 60 88 68 82 Q 60 76 52 82"
            fill="#FB7185"
            stroke="#3E2723"
            strokeWidth="2"
          />
        )}
        {chefId === 'chef-hana' && (
          <path
            d="M 50 82 Q 60 90 70 82"
            fill="#F43F5E"
            stroke="#3E2723"
            strokeWidth="2.5"
          />
        )}
        {chefId === 'chef-dimas' && (
          <path
            d="M 54 84 L 60 92 L 66 84 Z"
            fill="#F97316"
            stroke="#3E2723"
            strokeWidth="2"
          />
        )}

        {/* Neck */}
        <rect
          x="52"
          y="70"
          width="16"
          height="14"
          rx="4"
          fill="#FDDEC0"
          stroke="#3E2723"
          strokeWidth="3"
        />

        {/* Ears */}
        <circle cx="34" cy="58" r="6.5" fill="#FDDEC0" stroke="#3E2723" strokeWidth="2.5" />
        <circle cx="86" cy="58" r="6.5" fill="#FDDEC0" stroke="#3E2723" strokeWidth="2.5" />

        {/* Head Base */}
        <ellipse
          cx="60"
          cy="58"
          rx="26"
          ry="24"
          fill="#FFE7D1"
          stroke="#3E2723"
          strokeWidth="3.5"
        />

        {/* Hair Styles */}
        {chefId === 'chef-raka' ? (
          // Spiky dark hair
          <path
            d="M 35 48 C 35 30, 85 30, 85 48 C 82 40, 75 36, 68 38 C 62 34, 54 36, 48 40 C 42 36, 37 40, 35 48 Z"
            fill="#1E1B18"
          />
        ) : chefId === 'chef-hana' ? (
          // Soft styled brown hair with side bun
          <>
            <path
              d="M 33 54 C 33 34, 87 34, 87 54 C 82 42, 60 38, 33 54 Z"
              fill="#4A2810"
            />
            <circle cx="88" cy="46" r="9" fill="#4A2810" stroke="#3E2723" strokeWidth="2" />
          </>
        ) : chefId === 'chef-dimas' ? (
          // Short trim hair + subtle stubble
          <>
            <path
              d="M 34 50 C 34 35, 86 35, 86 50 C 82 42, 60 39, 34 50 Z"
              fill="#261E1A"
            />
            {/* Beard shadow */}
            <path
              d="M 44 68 C 50 76, 70 76, 76 68 C 76 74, 70 79, 60 79 C 50 79, 44 74, 44 68 Z"
              fill="#3E2723"
              fillOpacity="0.2"
            />
          </>
        ) : chefId === 'chef-naya' ? (
          // Playful side-swept locks
          <path
            d="M 33 52 C 34 32, 86 32, 87 52 C 80 40, 52 38, 33 52 Z"
            fill="#5D3A1A"
          />
        ) : (
          // Chef Mia: Friendly bangs
          <path
            d="M 34 52 C 36 34, 84 34, 86 52 C 78 42, 64 42, 60 48 C 56 42, 42 42, 34 52 Z"
            fill="#3B2314"
          />
        )}

        {/* Rosy Cheeks */}
        <ellipse cx="43" cy="64" rx="5" ry="3.5" fill="#FB7185" fillOpacity="0.45" />
        <ellipse cx="77" cy="64" rx="5" ry="3.5" fill="#FB7185" fillOpacity="0.45" />

        {/* Eyes & Eyebrows */}
        {chefId === 'chef-naya' && pose !== 'urgent' ? (
          // Winking eyes
          <>
            {/* Left Eye: Big sparkle eye */}
            <ellipse cx="49" cy="57" rx="3.5" ry="4.5" fill="#3E2723" />
            <circle cx="48" cy="55" r="1.5" fill="#FFFFFF" />
            {/* Right Eye: Cute Wink ^ */}
            <path
              d="M 68 58 Q 72 54 76 58"
              stroke="#3E2723"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            {/* Eyes */}
            <ellipse cx="49" cy="57" rx="3.5" ry="4.5" fill="#3E2723" />
            <circle cx="48" cy="55" r="1.5" fill="#FFFFFF" />
            <ellipse cx="71" cy="57" rx="3.5" ry="4.5" fill="#3E2723" />
            <circle cx="70" cy="55" r="1.5" fill="#FFFFFF" />
          </>
        )}

        {/* Eyebrows */}
        {chefId === 'chef-raka' ? (
          <>
            <path d="M 44 48 L 54 51" stroke="#3E2723" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 76 48 L 66 51" stroke="#3E2723" strokeWidth="2.8" strokeLinecap="round" />
          </>
        ) : chefId === 'chef-dimas' ? (
          <>
            <path d="M 44 49 L 55 49" stroke="#3E2723" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 65 49 L 76 49" stroke="#3E2723" strokeWidth="3.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M 44 48 Q 49 46 54 48" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 66 48 Q 71 46 76 48" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {/* Mouth */}
        {pose === 'happy' || pose === 'cooking' ? (
          // Big cheerful open smile
          <path
            d="M 52 66 Q 60 77 68 66 Z"
            fill="#EF4444"
            stroke="#3E2723"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        ) : pose === 'urgent' ? (
          // Focused O mouth
          <ellipse cx="60" cy="68" rx="4" ry="5" fill="#3E2723" />
        ) : (
          // Friendly gentle curve
          <path
            d="M 53 66 Q 60 72 67 66"
            stroke="#3E2723"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {/* Headwear Variations */}
        {chef.headwear === 'bandana' ? (
          // Sporty Fire Bandana
          <g>
            <path
              d="M 33 46 Q 60 40 87 46 L 85 36 Q 60 32 35 36 Z"
              fill="#F59E0B"
              stroke="#3E2723"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Red flame emblem on bandana */}
            <path d="M 57 41 Q 60 35 63 41 Q 60 44 57 41 Z" fill="#EF4444" />
          </g>
        ) : chef.headwear === 'flower' ? (
          // Classic Toque + Flower Pin
          <g>
            <path
              d="M 36 38 C 32 14, 88 14, 84 38 Z"
              fill="#FFFDF9"
              stroke="#3E2723"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="20" r="10" fill="#FFFDF9" />
            <circle cx="70" cy="20" r="10" fill="#FFFDF9" />
            <circle cx="60" cy="14" r="11" fill="#FFFDF9" />
            {/* Flower Pin */}
            <circle cx="78" cy="38" r="6" fill="#F43F5E" />
            <circle cx="78" cy="38" r="2.5" fill="#FDE047" />
          </g>
        ) : chef.headwear === 'beret' ? (
          // Stylish Gourmet Pastry Beret with Coin Pin
          <g>
            <path
              d="M 32 38 C 30 18, 92 14, 94 34 C 94 40, 40 42, 32 38 Z"
              fill="#065F46"
              stroke="#3E2723"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Gold coin pin on beret */}
            <circle cx="80" cy="30" r="6" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            <text x="78" y="33" fontSize="7" fontWeight="bold" fill="#78350F">
              $
            </text>
          </g>
        ) : chef.headwear === 'cap' ? (
          // Rugged Grill Cap with Fire badge
          <g>
            <path
              d="M 33 42 C 33 22, 87 22, 87 42 Z"
              fill="#1E3A8A"
              stroke="#3E2723"
              strokeWidth="3"
            />
            <path d="M 30 43 L 90 43 L 86 48 L 34 48 Z" fill="#172554" />
            <circle cx="60" cy="32" r="5" fill="#EA580C" />
          </g>
        ) : (
          // Chef Mia Toque (Classic puffy white hat with cute pink bow)
          <g>
            <path
              d="M 36 38 C 30 12, 90 12, 84 38 Z"
              fill="#FFFDF9"
              stroke="#3E2723"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <circle cx="48" cy="18" r="11" fill="#FFFDF9" stroke="#3E2723" strokeWidth="2.5" />
            <circle cx="72" cy="18" r="11" fill="#FFFDF9" stroke="#3E2723" strokeWidth="2.5" />
            <circle cx="60" cy="12" r="13" fill="#FFFDF9" stroke="#3E2723" strokeWidth="2.5" />
            {/* Hat Band */}
            <rect
              x="36"
              y="32"
              width="48"
              height="10"
              rx="2"
              fill="#FFFDF9"
              stroke="#3E2723"
              strokeWidth="3"
            />
          </g>
        )}

        {/* Hand Holding Spatula / Cooking Tool */}
        <g>
          {chef.tool === 'spatula' && (
            <g transform="translate(86, 76) rotate(15)">
              {/* Spatula Handle */}
              <rect x="0" y="0" width="5" height="34" rx="2.5" fill="#78350F" stroke="#3E2723" strokeWidth="2" />
              {/* Spatula Blade */}
              <path
                d="M -5 -16 L 10 -16 L 8 0 L -3 0 Z"
                fill="#E2E8F0"
                stroke="#3E2723"
                strokeWidth="2"
              />
              {/* Slits */}
              <line x1="0" y1="-12" x2="0" y2="-4" stroke="#3E2723" strokeWidth="1.5" />
              <line x1="5" y1="-12" x2="5" y2="-4" stroke="#3E2723" strokeWidth="1.5" />
              {/* Chef Hand Glove */}
              <circle cx="2.5" cy="16" r="6.5" fill="#FFE7D1" stroke="#3E2723" strokeWidth="2.5" />
            </g>
          )}

          {chef.tool === 'tongs' && (
            <g transform="translate(86, 76) rotate(15)">
              <path d="M 0 0 L 12 -18" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
              <path d="M 3 0 L -2 -18" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
              <circle cx="2" cy="8" r="7" fill="#EA580C" stroke="#3E2723" strokeWidth="2" />
            </g>
          )}

          {chef.tool === 'whisk' && (
            <g transform="translate(86, 76) rotate(15)">
              <rect x="0" y="0" width="5" height="30" rx="2.5" fill="#94A3B8" stroke="#3E2723" strokeWidth="2" />
              <ellipse cx="2.5" cy="-10" rx="7" ry="12" fill="none" stroke="#64748B" strokeWidth="2" />
              <circle cx="2.5" cy="14" r="6" fill="#FFE7D1" stroke="#3E2723" strokeWidth="2" />
            </g>
          )}

          {chef.tool === 'notepad' && (
            <g transform="translate(86, 76) rotate(10)">
              <rect x="-4" y="-8" width="16" height="22" rx="3" fill="#FEF08A" stroke="#3E2723" strokeWidth="2" />
              <circle cx="4" cy="12" r="6" fill="#FFE7D1" stroke="#3E2723" strokeWidth="2" />
            </g>
          )}
        </g>
      </svg>
    </motion.div>
  );
};
