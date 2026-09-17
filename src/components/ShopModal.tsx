import React from 'react';
import { KitchenUpgrades } from '../types/game';
import { motion } from 'motion/react';
import { X, Coins, Check } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface ShopModalProps {
  upgrades: KitchenUpgrades;
  playerCoins: number;
  onPurchaseUpgrade: (upgradeKey: keyof KitchenUpgrades, cost: number) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  upgrades,
  playerCoins,
  onPurchaseUpgrade,
  onClose,
}) => {
  const upgradeItems = [
    {
      key: 'stoveCount' as keyof KitchenUpgrades,
      name: 'Kapasitas Wajan Ekstra',
      icon: '🍳',
      description: 'Menambah slot wajan di kompor agar bisa memasak dan menggoreng lebih banyak pesanan sekaligus.',
      currentLevel: upgrades.stoveCount,
      maxLevel: 4,
      cost: upgrades.stoveCount === 2 ? 200 : 450,
      isMax: upgrades.stoveCount >= 4,
      levelLabel: `${upgrades.stoveCount} Slot Wajan`,
    },
    {
      key: 'stoveSpeedLevel' as keyof KitchenUpgrades,
      name: 'Upgrade Api & Panas Kompor',
      icon: '🔥',
      description: 'Meningkatkan intensitas api kompor sehingga masakan di wajan matang 20% lebih cepat.',
      currentLevel: upgrades.stoveSpeedLevel,
      maxLevel: 3,
      cost: upgrades.stoveSpeedLevel * 180,
      isMax: upgrades.stoveSpeedLevel >= 3,
      levelLabel: `Level ${upgrades.stoveSpeedLevel}`,
    },
    {
      key: 'ovenSpeedLevel' as keyof KitchenUpgrades,
      name: 'Upgrade Kecepatan Oven',
      icon: '🍕',
      description: 'Oven memanggang pizza, garlic bread, dan pastry lebih merata dalam waktu singkat.',
      currentLevel: upgrades.ovenSpeedLevel,
      maxLevel: 3,
      cost: upgrades.ovenSpeedLevel * 220,
      isMax: upgrades.ovenSpeedLevel >= 3,
      levelLabel: `Level ${upgrades.ovenSpeedLevel}`,
    },
    {
      key: 'drinkSpeedLevel' as keyof KitchenUpgrades,
      name: 'Dispenser Minuman Turbo',
      icon: '🥤',
      description: 'Dispenser menuangkan es teh, jus buah, dan minuman dingin dengan aliran berkecepatan tinggi.',
      currentLevel: upgrades.drinkSpeedLevel,
      maxLevel: 3,
      cost: upgrades.drinkSpeedLevel * 150,
      isMax: upgrades.drinkSpeedLevel >= 3,
      levelLabel: `Level ${upgrades.drinkSpeedLevel}`,
    },
    {
      key: 'burnAlarm' as keyof KitchenUpgrades,
      name: 'Sensor Peringatan Makanan Gosong',
      icon: '🚨',
      description: 'Membunyikan alarm nyaring dan efek visual merah berkedip saat makanan di wajan mendekati gosong.',
      currentLevel: upgrades.burnAlarm ? 1 : 0,
      maxLevel: 1,
      cost: 300,
      isMax: upgrades.burnAlarm,
      levelLabel: upgrades.burnAlarm ? 'Terpasang' : 'Belum Aktif',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl bg-[#FFFDF9] border-4 border-[#FF8A3D] rounded-3xl p-5 sm:p-6 text-[#3E2723] shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-[#F4E3D7]">
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-[#FF8A3D]">
              Peralatan & Fasilitas
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#3E2723]">TOKO UPGRADE DAPUR</h3>
            <p className="text-xs text-[#785949]">
              Tingkatkan performa kompor, oven, dan mesin agar memasak lebih kilat dan efisien!
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

        {/* Upgrade Items List */}
        <div className="flex flex-col gap-3">
          {upgradeItems.map((item) => {
            const canAfford = playerCoins >= item.cost;

            return (
              <div
                key={item.key}
                className="bg-white rounded-2xl border-2 border-[#F4E3D7] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:border-[#FFB088] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 rounded-2xl bg-[#FFF3E6] border-2 border-[#FFD2B8] flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-[#3E2723]">{item.name}</h4>
                      <span className="text-[10px] font-bold bg-[#FFE37D] text-[#854D0E] px-2 py-0.5 rounded-full border border-[#FDE047]">
                        {item.levelLabel}
                      </span>
                    </div>
                    <p className="text-xs text-[#785949] mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 w-full sm:w-auto">
                  {item.isMax ? (
                    <div className="flex items-center justify-center gap-1 px-4 py-2 bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] rounded-xl text-xs font-black">
                      <Check className="w-4 h-4" />
                      <span>Level Maksimal</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (canAfford) {
                          onPurchaseUpgrade(item.key, item.cost);
                          soundEngine.playCoin();
                        } else {
                          soundEngine.playUrgentTick();
                        }
                      }}
                      disabled={!canAfford}
                      className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                        canAfford
                          ? 'bg-gradient-to-r from-[#FF8A3D] to-[#E55934] hover:from-[#FFA05C] hover:to-[#FF8A3D] active:scale-97 text-white cursor-pointer'
                          : 'bg-[#FAF5F0] text-[#A07055] cursor-not-allowed border border-[#E8D9CE]'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5 text-amber-300" />
                      <span>Upgrade: {item.cost} Koin</span>
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
