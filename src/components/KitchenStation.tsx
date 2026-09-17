import React from 'react';
import { CookingSlot, FoodItem, KitchenUpgrades, PreparedFood } from '../types/game';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Trash2, BellRing, CheckCircle2, Utensils, Sparkles } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface KitchenStationProps {
  slots: CookingSlot[];
  availableFoods: FoodItem[];
  preparedFoods: PreparedFood[];
  upgrades: KitchenUpgrades;
  onStartCooking: (slotId: string, food: FoodItem) => void;
  onCollectCookedItem: (slotId: string) => void;
  onDiscardBurntItem: (slotId: string) => void;
  onServePreparedFood: (prepFoodId: string) => void;
  onDiscardPreparedFood: (prepFoodId: string) => void;
}

export const KitchenStation: React.FC<KitchenStationProps> = ({
  slots,
  availableFoods,
  preparedFoods,
  onStartCooking,
  onCollectCookedItem,
  onDiscardBurntItem,
  onServePreparedFood,
  onDiscardPreparedFood,
}) => {
  const panFoods = availableFoods.filter((f) => f.stationType === 'pan' || f.stationType === 'pot');
  const ovenFoods = availableFoods.filter((f) => f.stationType === 'oven');
  const drinkFoods = availableFoods.filter((f) => f.stationType === 'drink');

  const panSlots = slots.filter((s) => s.type === 'pan' || s.type === 'pot');
  const ovenSlots = slots.filter((s) => s.type === 'oven');
  const drinkSlots = slots.filter((s) => s.type === 'drink');

  // Drag start for ingredients
  const handleDragStartIngredient = (e: React.DragEvent, food: FoodItem) => {
    e.dataTransfer.setData('text/ingredient-id', food.id);
    e.dataTransfer.setData('text/station-type', food.stationType);
    soundEngine.playClick();
  };

  // Drag start for prepared food
  const handleDragStartPrepared = (e: React.DragEvent, prep: PreparedFood) => {
    e.dataTransfer.setData('text/food-id', prep.foodId);
    e.dataTransfer.setData('text/prep-id', prep.id);
    soundEngine.playSpatulaFlip();
  };

  // Drop onto cooking slot
  const handleDropOnSlot = (e: React.DragEvent, slot: CookingSlot) => {
    e.preventDefault();
    if (slot.state !== 'empty') return;
    const ingredientId = e.dataTransfer.getData('text/ingredient-id');
    const food = availableFoods.find((f) => f.id === ingredientId);
    if (food) {
      onStartCooking(slot.id, food);
    }
  };

  // Drop onto trash can
  const handleDropOnTrash = (e: React.DragEvent) => {
    e.preventDefault();
    const prepId = e.dataTransfer.getData('text/prep-id');
    if (prepId) {
      onDiscardPreparedFood(prepId);
      return;
    }
    const slotId = e.dataTransfer.getData('text/slot-id');
    if (slotId) {
      onDiscardBurntItem(slotId);
    }
  };

  return (
    <div className="flex flex-col gap-3.5 bg-[#FFFDF9]/95 text-[#3E2723] p-3.5 sm:p-4 rounded-3xl border-4 border-[#FF8A3D] shadow-2xl backdrop-blur-md">
      {/* Shelf 1: Racik Bahan (Ingredients Bar) */}
      <div className="bg-[#FFF8F0] p-3 rounded-2xl border-2 border-[#FFE2CF] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black tracking-wider uppercase text-[#E55934] flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#FF8A3D]" />
            Bahan Makanan & Resep (Klik / Seret ke Alat Masak)
          </span>
          <span className="text-[11px] text-[#A07055] hidden sm:inline">
            Klik atau seret ke kompor/oven/dispenser yang kosong
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Pan / Wok Foods */}
          {panFoods.map((food) => (
            <button
              key={food.id}
              draggable
              onDragStart={(e) => handleDragStartIngredient(e, food)}
              onClick={() => {
                const emptySlot = panSlots.find((s) => s.state === 'empty');
                if (emptySlot) {
                  onStartCooking(emptySlot.id, food);
                } else {
                  soundEngine.playUrgentTick();
                }
              }}
              className="group flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-[#FFF3E6] active:scale-95 text-[#3E2723] rounded-2xl border-2 border-[#FFD2B8] hover:border-[#FF8A3D] transition-all cursor-grab active:cursor-grabbing shadow-2xs"
            >
              <span className="text-2xl group-hover:scale-125 transition-transform">{food.icon}</span>
              <div className="text-left">
                <div className="text-xs font-black leading-tight">{food.name}</div>
                <div className="text-[10px] text-[#FF8A3D] font-bold">
                  🍳 {food.cookTime}s • Rp{food.price}
                </div>
              </div>
            </button>
          ))}

          {/* Oven Foods */}
          {ovenFoods.map((food) => (
            <button
              key={food.id}
              draggable
              onDragStart={(e) => handleDragStartIngredient(e, food)}
              onClick={() => {
                const emptySlot = ovenSlots.find((s) => s.state === 'empty');
                if (emptySlot) {
                  onStartCooking(emptySlot.id, food);
                } else {
                  soundEngine.playUrgentTick();
                }
              }}
              className="group flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-[#FFE4E6] active:scale-95 text-[#3E2723] rounded-2xl border-2 border-[#FDA4AF] hover:border-[#F43F5E] transition-all cursor-grab active:cursor-grabbing shadow-2xs"
            >
              <span className="text-2xl group-hover:scale-125 transition-transform">{food.icon}</span>
              <div className="text-left">
                <div className="text-xs font-black leading-tight">{food.name}</div>
                <div className="text-[10px] text-[#E11D48] font-bold">
                  🔥 Oven {food.cookTime}s • Rp{food.price}
                </div>
              </div>
            </button>
          ))}

          {/* Drink Dispenser Foods */}
          {drinkFoods.map((food) => (
            <button
              key={food.id}
              draggable
              onDragStart={(e) => handleDragStartIngredient(e, food)}
              onClick={() => {
                const emptySlot = drinkSlots.find((s) => s.state === 'empty');
                if (emptySlot) {
                  onStartCooking(emptySlot.id, food);
                } else {
                  soundEngine.playUrgentTick();
                }
              }}
              className="group flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-[#E0F2FE] active:scale-95 text-[#3E2723] rounded-2xl border-2 border-[#BAE6FD] hover:border-[#0284C7] transition-all cursor-grab active:cursor-grabbing shadow-2xs"
            >
              <span className="text-2xl group-hover:scale-125 transition-transform">{food.icon}</span>
              <div className="text-left">
                <div className="text-xs font-black leading-tight">{food.name}</div>
                <div className="text-[10px] text-[#0284C7] font-bold">
                  🥤 Dispenser {food.cookTime}s • Rp{food.price}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cooking Workstations: Pan & Wok, Oven, Drink Fountain */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Workstation 1: Kompor & Wajan */}
        <div className="bg-white rounded-2xl p-3 border-2 border-[#FFD2B8] shadow-2xs">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#F4E3D7]">
            <span className="text-xs font-black text-[#E55934] uppercase tracking-wide flex items-center gap-1.5">
              🍳 Kompor & Wajan
            </span>
            <span className="text-[10px] bg-[#FFF0E0] px-2 py-0.5 rounded-full text-[#785949] font-bold">
              {panSlots.filter((s) => s.state !== 'empty').length}/{panSlots.length} Aktif
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {panSlots.map((slot, idx) =>
              renderSlotItem(slot, idx, onCollectCookedItem, onDiscardBurntItem, handleDropOnSlot)
            )}
          </div>
        </div>

        {/* Workstation 2: Oven Pemanggang */}
        <div className="bg-white rounded-2xl p-3 border-2 border-[#FDA4AF] shadow-2xs">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#FFE4E6]">
            <span className="text-xs font-black text-[#E11D48] uppercase tracking-wide flex items-center gap-1.5">
              🔥 Oven Pemanggang
            </span>
            <span className="text-[10px] bg-[#FFF1F2] px-2 py-0.5 rounded-full text-[#BE123C] font-bold">
              {ovenSlots.length > 0
                ? ovenSlots.some((s) => s.state !== 'empty')
                  ? 'Sedang Memanggang'
                  : 'Siap'
                : 'Terkunci'}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {ovenSlots.length > 0 ? (
              ovenSlots.map((slot, idx) =>
                renderSlotItem(slot, idx, onCollectCookedItem, onDiscardBurntItem, handleDropOnSlot)
              )
            ) : (
              <div className="h-28 flex flex-col items-center justify-center text-[#A07055] text-xs text-center border-2 border-dashed border-[#F4E3D7] rounded-2xl p-2 bg-[#FFF8F0]">
                <span>Oven aktif untuk Pizza & Cake</span>
              </div>
            )}
          </div>
        </div>

        {/* Workstation 3: Dispenser Minuman */}
        <div className="bg-white rounded-2xl p-3 border-2 border-[#BAE6FD] shadow-2xs">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#E0F2FE]">
            <span className="text-xs font-black text-[#0284C7] uppercase tracking-wide flex items-center gap-1.5">
              🥤 Mesin Minuman Dingin
            </span>
            <span className="text-[10px] bg-[#F0F9FF] px-2 py-0.5 rounded-full text-[#0369A1] font-bold">
              Otomatis
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {drinkSlots.length > 0 ? (
              drinkSlots.map((slot, idx) =>
                renderSlotItem(slot, idx, onCollectCookedItem, onDiscardBurntItem, handleDropOnSlot)
              )
            ) : (
              <div className="h-28 flex items-center justify-center text-[#A07055] text-xs border-2 border-dashed border-[#F4E3D7] rounded-2xl bg-[#FFF8F0]">
                Dispenser Minuman Siap
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Serving Counter Tray & Trash Can */}
      <div className="bg-white p-3 rounded-2xl border-2 border-[#10B981]/50 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Ready Food Counter */}
        <div className="flex-1 min-w-[280px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-black text-[#059669] uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              Meja Saji Makanan Siap ({preparedFoods.length}/6)
            </span>
            <span className="text-[11px] text-[#785949] font-medium">
              Klik hidangan untuk menyajikan ke customer!
            </span>
          </div>

          <div className="flex items-center gap-2 min-h-[58px] p-2 bg-[#FFF8F0] rounded-xl border border-[#FFE2CF] overflow-x-auto">
            {preparedFoods.length === 0 ? (
              <div className="text-[#A07055] text-xs italic px-2 py-1">
                Belum ada makanan di meja saji. Masak bahan di atas lalu klik untuk pindahkan ke sini!
              </div>
            ) : (
              <AnimatePresence>
                {preparedFoods.map((pf) => (
                  <motion.div
                    key={pf.id}
                    layout
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    draggable
                    onDragStart={(e) => handleDragStartPrepared(e, pf)}
                    className="relative group flex-shrink-0"
                  >
                    <button
                      onClick={() => onServePreparedFood(pf.id)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-b from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] active:scale-95 text-white rounded-2xl border-2 border-[#6EE7B7] shadow-md cursor-grab active:cursor-grabbing transition-all"
                      title={`Sajikan ${pf.name} ke customer`}
                    >
                      <span className="text-2xl animate-bounce">{pf.icon}</span>
                      <div className="text-left">
                        <div className="text-xs font-black">{pf.name}</div>
                        <div className="text-[10px] text-[#D1FAE5]">Sajikan!</div>
                      </div>
                    </button>

                    {/* Small discard X button on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDiscardPreparedFood(pf.id);
                      }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-md cursor-pointer opacity-80 group-hover:opacity-100 transition-opacity"
                      title="Buang makanan ke tempat sampah"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Trash Can Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
          }}
          onDrop={handleDropOnTrash}
          className="flex-shrink-0 flex items-center gap-2 pl-3 border-l border-[#F4E3D7]"
        >
          <div className="flex flex-col items-center">
            <div className="w-13 h-13 bg-[#FEE2E2] border-2 border-[#FCA5A5] hover:border-[#EF4444] rounded-2xl flex items-center justify-center text-[#DC2626] shadow-inner transition-colors">
              <Trash2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-[#DC2626] mt-1 uppercase">Tong Sampah</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper renderer for individual cooking slots
function renderSlotItem(
  slot: CookingSlot,
  index: number,
  onCollectCookedItem: (slotId: string) => void,
  onDiscardBurntItem: (slotId: string) => void,
  onDropOnSlot: (e: React.DragEvent, slot: CookingSlot) => void
) {
  const isCooking = slot.state === 'cooking';
  const isReady = slot.state === 'ready';
  const isBurning = slot.state === 'burning';
  const isBurnt = slot.state === 'burnt';
  const food = slot.targetFood;

  if (slot.state === 'empty') {
    return (
      <div
        key={slot.id}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }}
        onDrop={(e) => onDropOnSlot(e, slot)}
        className="h-28 rounded-2xl border-2 border-dashed border-[#FFD2B8] bg-[#FFF8F0] hover:bg-[#FFF0E0] hover:border-[#FF8A3D] flex flex-col items-center justify-center text-[#A07055] p-2 text-center transition-colors cursor-pointer"
      >
        <span className="text-2xl opacity-50">🍳</span>
        <span className="text-[11px] font-black text-[#785949] mt-1">Slot {index + 1} Kosong</span>
        <span className="text-[9px] text-[#A07055]">Pilih / letakkan bahan</span>
      </div>
    );
  }

  // Active cooking state
  return (
    <div
      key={slot.id}
      draggable={isBurnt || isReady}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/slot-id', slot.id);
        if (food) {
          e.dataTransfer.setData('text/food-id', food.id);
        }
      }}
      className={`relative h-28 rounded-2xl border-2 p-2 flex flex-col justify-between transition-all overflow-hidden ${
        isBurnt
          ? 'bg-[#1C1917] border-[#DC2626] ring-2 ring-[#EF4444]'
          : isBurning
          ? 'bg-[#FFF1F2] border-[#F43F5E] animate-pulse ring-2 ring-[#FB7185]'
          : isReady
          ? 'bg-[#ECFDF5] border-[#10B981] ring-2 ring-[#34D399]'
          : 'bg-[#FFF8F0] border-[#FFD2B8]'
      }`}
    >
      {/* Top Header info */}
      <div className="flex items-center justify-between z-10">
        <span className="text-xs font-black truncate max-w-[100px] text-[#3E2723] flex items-center gap-1">
          <span>{food?.icon}</span>
          <span className="truncate">{food?.name}</span>
        </span>
        {isBurning && (
          <span className="text-[9px] font-black text-white bg-[#EF4444] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse">
            <BellRing className="w-3 h-3 text-white" />
            BAHAYA!
          </span>
        )}
      </div>

      {/* Center animation / icon */}
      <div className="flex items-center justify-center my-0.5 z-10">
        {isBurnt ? (
          <div className="flex flex-col items-center text-[#F87171] animate-pulse">
            <span className="text-2xl">🪨💥</span>
            <span className="text-[10px] font-black uppercase text-[#FCA5A5]">GOSONG!</span>
          </div>
        ) : isBurning ? (
          <div className="flex flex-col items-center text-[#DC2626]">
            <span className="text-2xl animate-spin">🔥💨</span>
            <span className="text-[10px] font-black text-[#EF4444]">CEPAT ANGKAT!</span>
          </div>
        ) : isReady ? (
          <div className="flex flex-col items-center text-[#059669] animate-bounce">
            <span className="text-2xl">{food?.icon}✨</span>
            <span className="text-[10px] font-black uppercase text-[#10B981]">MATANG! DING!</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-[#D97706]">
            <motion.span
              animate={{ rotate: [-6, 6, -6], scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="text-2xl"
            >
              {food?.icon}
            </motion.span>
            <span className="text-[10px] font-bold text-[#A07055]">Sedang Dimasak...</span>
          </div>
        )}
      </div>

      {/* Action / Progress Footer */}
      <div className="z-10">
        {isBurnt ? (
          <button
            onClick={() => onDiscardBurntItem(slot.id)}
            className="w-full py-1 bg-[#DC2626] hover:bg-[#B91C1C] active:scale-95 text-white text-[11px] font-black rounded-xl flex items-center justify-center gap-1 cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3 h-3" />
            Buang Gosong
          </button>
        ) : isReady || isBurning ? (
          <button
            onClick={() => onCollectCookedItem(slot.id)}
            className={`w-full py-1 text-white text-[11px] font-black rounded-xl flex items-center justify-center gap-1 active:scale-95 cursor-pointer shadow-xs ${
              isBurning ? 'bg-[#EF4444] hover:bg-[#DC2626]' : 'bg-[#10B981] hover:bg-[#059669] animate-pulse'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            Angkat Makanan!
          </button>
        ) : (
          /* Cooking Progress Bar */
          <div className="w-full bg-[#E8D9CE] rounded-full h-2.5 overflow-hidden border border-[#D8C5B6]">
            <div
              className="h-full bg-gradient-to-r from-[#F59E0B] via-[#FF8A3D] to-[#10B981] transition-all duration-200"
              style={{ width: `${Math.min(100, slot.progress)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
