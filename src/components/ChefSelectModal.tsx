import React from 'react';
import { Chef } from '../types/game';
import { CHEFS_LIST } from '../data/gameData';
import { motion } from 'motion/react';
import { Check, Lock, Sparkles, X, Coins, Zap, HeartHandshake, Flame, ShieldAlert } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { ChefAvatar } from './ChefAvatar';

interface ChefSelectModalProps {
  currentChefId: string;
  unlockedChefIds: string[];
  playerCoins: number;
  onSelectChef: (chefId: string) => void;
  onUnlockChef: (chef: Chef) => void;
  onClose: () => void;
}

export const ChefSelectModal: React.FC<ChefSelectModalProps> = ({
  currentChefId,
  unlockedChefIds,
  playerCoins,
  onSelectChef,
  onUnlockChef,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-3xl bg-[#FFFDF9] border-4 border-[#FF8A3D] rounded-3xl p-5 sm:p-6 text-[#3E2723] shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#F4E3D7]">
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-[#FF8A3D]">
              Karakter & Keahlian Khusus
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#3E2723]">PILIH CHEF ANDA</h3>
            <p className="text-xs text-[#785949]">
              Setiap chef memiliki spesialisasi dan perk yang mempermudah layanan restoran!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF0E0] rounded-2xl border border-[#FFD2B8] text-[#D97706] text-xs font-black">
              <Coins className="w-4 h-4 text-[#F59E0B]" />
              <span>{playerCoins} Koin</span>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-[#F4E3D7] hover:bg-[#E8D0C0] text-[#3E2723] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chefs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHEFS_LIST.map((chef) => {
            const isUnlocked = unlockedChefIds.includes(chef.id);
            const isSelected = currentChefId === chef.id;
            const canAfford = playerCoins >= chef.unlockCost;

            return (
              <div
                key={chef.id}
                className={`relative rounded-3xl border-3 p-4 flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'bg-[#FFF3E6] border-[#FF8A3D] shadow-lg ring-2 ring-[#FF8A3D]'
                    : isUnlocked
                    ? 'bg-white border-[#F4E3D7] hover:border-[#FFB088]'
                    : 'bg-[#FAF5F0] border-[#E8D9CE] opacity-85'
                }`}
              >
                {/* Active Selection Tag */}
                {isSelected && (
                  <div className="absolute -top-3 right-4 bg-[#10B981] text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Sedang Dipakai</span>
                  </div>
                )}

                {/* Avatar & Character Info */}
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 rounded-2xl bg-[#FFEBD6] border-2 border-[#FFD2B8] flex items-center justify-center shadow-xs flex-shrink-0 overflow-hidden">
                    <ChefAvatar
                      chefId={chef.id}
                      size="md"
                      pose={isSelected ? 'happy' : 'idle'}
                      showAnimation={isSelected}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base font-black text-[#3E2723] truncate">{chef.name}</h4>
                      {!isUnlocked && <Lock className="w-3.5 h-3.5 text-[#A07055] flex-shrink-0" />}
                    </div>
                    <div className="text-xs font-bold text-[#E55934]">{chef.title}</div>
                    <p className="text-[11px] text-[#785949] mt-1 leading-relaxed line-clamp-2">
                      {chef.description}
                    </p>
                  </div>
                </div>

                {/* Stats Breakdown Bars */}
                <div className="mt-3 grid grid-cols-2 gap-1.5 bg-[#FFF8F0] p-2.5 rounded-2xl border border-[#F4E3D7]">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#785949]">
                    <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Kecepatan: {Math.round(chef.speedMultiplier * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#785949]">
                    <HeartHandshake className="w-3.5 h-3.5 text-[#EC4899]" />
                    <span>Sabar: +{chef.patienceBonus}s</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#785949]">
                    <Coins className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Bonus Koin: x{chef.coinMultiplier}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#785949]">
                    <Flame className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>Tahan Gosong: {chef.burnToleranceMultiplier}x</span>
                  </div>
                </div>

                {/* Perk Badge */}
                <div className="mt-2.5 p-2 rounded-xl bg-[#FFF3E6] border border-[#FFD2B8] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF8A3D] flex-shrink-0" />
                  <div>
                    <div className="text-xs font-black text-[#E55934]">{chef.perkName}</div>
                    <div className="text-[10px] text-[#785949] leading-tight">{chef.perkDescription}</div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-3.5">
                  {isSelected ? (
                    <div className="w-full py-2 bg-[#10B981]/15 text-[#059669] border border-[#10B981]/30 rounded-2xl text-xs font-black flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" />
                      <span>Chef Sedang Bertugas</span>
                    </div>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => {
                        onSelectChef(chef.id);
                        soundEngine.playDing();
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-[#FF8A3D] to-[#E55934] hover:from-[#FFA05C] hover:to-[#FF8A3D] text-white active:scale-97 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md"
                    >
                      PILIH CHEF INI
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (canAfford) {
                          onUnlockChef(chef);
                          soundEngine.playCoin();
                        } else {
                          soundEngine.playUrgentTick();
                        }
                      }}
                      disabled={!canAfford}
                      className={`w-full py-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                        canAfford
                          ? 'bg-[#F59E0B] hover:bg-[#D97706] active:scale-97 text-white cursor-pointer'
                          : 'bg-[#E8D9CE] text-[#A07055] cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Buka Karakter: {chef.unlockCost} Koin</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
