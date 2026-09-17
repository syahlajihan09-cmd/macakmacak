import React, { useState, useRef, useEffect } from 'react';
import { Chef, Restaurant } from '../types/game';
import { MoreVertical, Coins, AlertTriangle, Play, RotateCcw, LogOut, Flame } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface GameHUDProps {
  restaurant: Restaurant;
  levelNumber: number;
  chef: Chef;
  coinsEarned: number;
  totalCoins: number;
  customersServed: number;
  targetCustomers: number;
  customersLost: number;
  maxLostAllowed: number;
  comboCount: number;
  comboMultiplier: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onRestart: () => void;
  onExit: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  restaurant,
  levelNumber,
  chef,
  coinsEarned,
  customersServed,
  targetCustomers,
  customersLost,
  maxLostAllowed,
  comboCount,
  comboMultiplier,
  onPause,
  onRestart,
  onExit,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close three-dot menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const progressPercent = Math.min(100, Math.round((customersServed / targetCustomers) * 100));
  const isCriticalLost = customersLost >= maxLostAllowed - 1;

  return (
    <header className="w-full relative z-40 flex items-center justify-between px-3 py-2 bg-[#FFFDF9]/95 border-b-3 border-[#FF8A3D] shadow-md backdrop-blur-md text-[#3E2723] select-none">
      {/* TOP-LEFT: Level number, Current target, Progress */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FF8A3D] text-white flex items-center justify-center font-black text-xs shadow-xs">
            L{levelNumber}
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-[#E55934] leading-tight">
              {restaurant.name}
            </div>
            <div className="text-xs font-black text-[#3E2723]">
              Target: {customersServed}/{targetCustomers} Pelanggan
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="hidden sm:flex flex-col w-28 lg:w-36 gap-0.5">
          <div className="flex justify-between text-[9px] font-bold text-[#785949]">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-[#FFE2CF] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF8A3D] to-[#10B981] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Combo Badge if active */}
        {comboCount >= 2 && (
          <div className="flex items-center gap-1 bg-[#FFF0E0] border border-[#FF8A3D] text-[#E55934] font-black text-[11px] px-2 py-0.5 rounded-full animate-pulse shadow-xs">
            <Flame className="w-3.5 h-3.5" />
            <span>x{comboMultiplier} COMBO!</span>
          </div>
        )}
      </div>

      {/* TOP-CENTER: Coin counter */}
      <div className="flex items-center gap-2 bg-[#FFF8E7] border-2 border-[#FBBF24] px-4 py-1 rounded-2xl shadow-xs">
        <Coins className="w-4 h-4 text-[#D97706]" />
        <span className="font-black text-sm text-[#B45309]">+{coinsEarned}</span>
      </div>

      {/* TOP-RIGHT: Customer Lost counter & Three-dot menu `•••` */}
      <div className="flex items-center gap-3 relative" ref={menuRef}>
        {/* Customer Lost Counter */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-2xl border text-xs font-black transition-all ${
            isCriticalLost
              ? 'bg-[#FEE2E2] border-[#EF4444] text-[#DC2626] animate-pulse ring-1 ring-red-400'
              : 'bg-[#FFF5EE] border-[#FFD2B8] text-[#9A3412]'
          }`}
        >
          <AlertTriangle className={`w-3.5 h-3.5 ${isCriticalLost ? 'text-red-600 animate-bounce' : 'text-amber-600'}`} />
          <span>Kabur: {customersLost}/{maxLostAllowed}</span>
        </div>

        {/* Three-Dot Menu Button `•••` */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setShowMenu(!showMenu);
          }}
          className="w-8 h-8 rounded-xl bg-white hover:bg-[#FFF0E0] active:scale-95 border-2 border-[#FFD2B8] flex items-center justify-center cursor-pointer shadow-xs transition-transform"
          aria-label="Menu"
        >
          <MoreVertical className="w-4 h-4 text-[#3E2723]" />
        </button>

        {/* Small Floating Menu */}
        {showMenu && (
          <div className="absolute top-11 right-0 w-36 bg-[#FFFDF9] border-2 border-[#FF8A3D] rounded-2xl shadow-2xl p-1.5 flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95">
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowMenu(false);
                onPause();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#FFF0E0] text-xs font-black text-[#3E2723] text-left cursor-pointer transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-[#059669]" />
              <span>PAUSE</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setShowMenu(false);
                onRestart();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#FFF0E0] text-xs font-black text-[#3E2723] text-left cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#D97706]" />
              <span>RESTART</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setShowMenu(false);
                onExit();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#FEE2E2] text-xs font-black text-[#DC2626] text-left cursor-pointer transition-colors border-t border-[#F4E3D7] mt-0.5 pt-1"
            >
              <LogOut className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>EXIT</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
