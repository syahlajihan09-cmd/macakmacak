import React from 'react';
import { CookingSlot, FoodItem, PreparedFood } from '../types/game';
import { Flame, Clock, Trash2, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface KitchenActionDockProps {
  slots: CookingSlot[];
  availableFoods: FoodItem[];
  preparedFoods: PreparedFood[];
  onStartCooking: (foodId: string) => void;
  onCollectCookedItem: (slotId: string) => void;
  onDiscardBurntItem: (slotId: string) => void;
  onServePreparedFood: (preparedId: string) => void;
  onDiscardPreparedFood: (preparedId: string) => void;
}

export const KitchenActionDock: React.FC<KitchenActionDockProps> = ({
  slots,
  availableFoods,
  preparedFoods,
  onStartCooking,
  onCollectCookedItem,
  onDiscardBurntItem,
  onServePreparedFood,
  onDiscardPreparedFood,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-2 py-1.5 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
      {/* Left: Quick Ingredient Cook Dispenser */}
      <div className="flex items-center gap-1.5 bg-[#FFFDF9]/95 border-2 border-[#FF8A3D] rounded-2xl px-2.5 py-1.5 shadow-lg backdrop-blur-xs">
        <span className="text-[10px] font-black uppercase text-[#E55934] mr-1 hidden sm:inline">
          Masak:
        </span>
        {availableFoods.map((food) => {
          const hasFreeSlot = slots.some((s) => s.state === 'empty');
          return (
            <button
              key={food.id}
              disabled={!hasFreeSlot}
              onClick={() => {
                soundEngine.playSizzle();
                onStartCooking(food.id);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                hasFreeSlot
                  ? 'bg-gradient-to-b from-[#FFF5EE] to-[#FFE2CF] hover:from-[#FFE2CF] hover:to-[#FFD2B8] active:scale-95 text-[#3E2723] border border-[#FFB088]'
                  : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed opacity-50'
              }`}
            >
              <span className="text-base">{food.icon}</span>
              <span className="text-[11px]">{food.name}</span>
            </button>
          );
        })}
      </div>

      {/* Center: Live 3D Stoves / Cooking Slot Status */}
      <div className="flex items-center gap-1.5 bg-[#FFFDF9]/95 border-2 border-[#FF8A3D] rounded-2xl px-2.5 py-1.5 shadow-lg backdrop-blur-xs">
        <span className="text-[10px] font-black uppercase text-[#785949] mr-1 hidden md:inline">
          Kompor 3D:
        </span>
        {slots.map((slot, idx) => {
          if (slot.state === 'empty') {
            return (
              <div
                key={slot.id}
                className="w-16 h-8 rounded-xl border border-dashed border-[#FFB088] bg-[#FFF8F0] flex items-center justify-center text-[10px] font-black text-[#A07055]"
              >
                P{idx + 1} Kosong
              </div>
            );
          }

          if (slot.state === 'cooking') {
            return (
              <div
                key={slot.id}
                className="w-20 h-8 rounded-xl bg-amber-50 border border-amber-300 px-1.5 flex flex-col justify-center shadow-xs"
              >
                <div className="flex items-center justify-between text-[9px] font-bold text-amber-800">
                  <span className="truncate">{slot.targetFood?.name}</span>
                  <Flame className="w-2.5 h-2.5 text-amber-600 animate-bounce" />
                </div>
                <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-150"
                    style={{ width: `${Math.min(100, slot.progress)}%` }}
                  />
                </div>
              </div>
            );
          }

          if (slot.state === 'ready') {
            return (
              <button
                key={slot.id}
                onClick={() => {
                  soundEngine.playDing();
                  onCollectCookedItem(slot.id);
                }}
                className="h-8 px-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-[10px] flex items-center gap-1 cursor-pointer animate-pulse shadow-xs"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>ANGKAT!</span>
              </button>
            );
          }

          if (slot.state === 'burning') {
            return (
              <button
                key={slot.id}
                onClick={() => {
                  soundEngine.playDing();
                  onCollectCookedItem(slot.id);
                }}
                className="h-8 px-2 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-black text-[10px] flex items-center gap-1 cursor-pointer animate-ping shadow-xs"
              >
                <Clock className="w-3 h-3" />
                <span>CEPAT ANGKAT!</span>
              </button>
            );
          }

          // Burnt
          return (
            <button
              key={slot.id}
              onClick={() => {
                soundEngine.playTrash();
                onDiscardBurntItem(slot.id);
              }}
              className="h-8 px-2 rounded-xl bg-stone-800 hover:bg-stone-900 active:scale-95 text-red-400 font-black text-[10px] flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3 h-3" />
              <span>GOSONG (BUANG)</span>
            </button>
          );
        })}
      </div>

      {/* Right: Meja Saji (Prepared Food Ready to Serve or Discard) */}
      <div className="flex items-center gap-1.5 bg-[#FFFDF9]/95 border-2 border-[#10B981] rounded-2xl px-2.5 py-1.5 shadow-lg backdrop-blur-xs">
        <span className="text-[10px] font-black uppercase text-[#059669] mr-1 hidden sm:inline">
          Meja Saji ({preparedFoods.length}/3):
        </span>
        {preparedFoods.length === 0 ? (
          <span className="text-[10px] text-[#785949] italic py-1">Belum ada makanan matang</span>
        ) : (
          preparedFoods.map((pf) => (
            <div
              key={pf.id}
              className="flex items-center gap-1 bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded-xl shadow-xs"
            >
              <span className="text-sm">{pf.icon}</span>
              <button
                onClick={() => {
                  soundEngine.playOrderServed();
                  onServePreparedFood(pf.id);
                }}
                className="text-[10px] font-black text-[#059669] hover:underline cursor-pointer"
              >
                Sajikan
              </button>
              <button
                onClick={() => {
                  soundEngine.playTrash();
                  onDiscardPreparedFood(pf.id);
                }}
                className="text-stone-400 hover:text-red-500 cursor-pointer p-0.5"
                title="Buang jika tidak terpakai"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
