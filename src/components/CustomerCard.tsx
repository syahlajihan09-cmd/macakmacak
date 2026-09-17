import React from 'react';
import { Customer, PreparedFood, CookingSlot } from '../types/game';
import { CUSTOMER_PERSONALITIES } from '../data/gameData';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Clock, Sparkles, Check, Flame } from 'lucide-react';
import { CustomerAvatar } from './CustomerAvatar';

interface CustomerCardProps {
  customer: Customer;
  preparedFoods?: PreparedFood[];
  cookingSlots?: CookingSlot[];
  onItemClick?: (foodId: string) => void;
  onCustomerDropFood?: (foodId: string) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  preparedFoods = [],
  cookingSlots = [],
  onItemClick,
  onCustomerDropFood,
}) => {
  const personalityInfo =
    CUSTOMER_PERSONALITIES.find((p) => p.type === customer.personality) || CUSTOMER_PERSONALITIES[0];
  const waitRatio = customer.elapsedWaitTime / customer.maxWaitTime;
  const remainingSeconds = Math.max(0, Math.ceil(customer.maxWaitTime - customer.elapsedWaitTime));

  const isAngry = customer.elapsedWaitTime > 20 && customer.mood !== 'served' && !customer.isLeaving;
  const isBored = customer.elapsedWaitTime > 10 && customer.elapsedWaitTime <= 20 && customer.mood !== 'served' && !customer.isLeaving;
  const isServed = customer.mood === 'served';
  const isLeaving = customer.isLeaving || customer.mood === 'leaving';

  // Dialogue hint per user spec:
  // 0-10s: "Aku masih menunggu..."
  // 10-20s: "Ayo cepat!"
  // 20-30s: "Aku bisa pergi sekarang!"
  let dialogueText = 'Aku masih menunggu...';
  let moodBadgeText = 'Sabar 😊';
  let moodBadgeColor = 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
  let progressBarColor = 'bg-[#10B981]';

  if (isServed) {
    dialogueText = 'Terima kasih! Enak sekali! ❤️';
    moodBadgeText = 'Puas! 😍';
    moodBadgeColor = 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
    progressBarColor = 'bg-[#10B981]';
  } else if (isLeaving) {
    dialogueText = 'Terlalu lama! Aku pergi!';
    moodBadgeText = 'Kabur! 😤';
    moodBadgeColor = 'bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]';
    progressBarColor = 'bg-[#DC2626]';
  } else if (isAngry) {
    dialogueText = 'Aku bisa pergi sekarang! 💢';
    moodBadgeText = 'Marah! 😡';
    moodBadgeColor = 'bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5] animate-pulse';
    progressBarColor = 'bg-[#EF4444]';
  } else if (isBored) {
    dialogueText = 'Ayo cepat! ⏳';
    moodBadgeText = 'Menunggu 😐';
    moodBadgeColor = 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]';
    progressBarColor = 'bg-[#F59E0B]';
  }

  // Calculate percentage of time left
  const progressPercent = Math.max(0, Math.min(100, (1 - waitRatio) * 100));

  // Check if all remaining uncompleted items in this order are already ready on the serving tray!
  const uncompletedItems = customer.orderItems.filter((it) => !it.isCompleted);
  const readyPreparedFoodIds = preparedFoods.map((pf) => pf.foodId);
  const canFulfillNow =
    uncompletedItems.length > 0 &&
    uncompletedItems.some((it) => readyPreparedFoodIds.includes(it.foodId));

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const foodId = e.dataTransfer.getData('text/food-id');
    if (foodId && onCustomerDropFood) {
      onCustomerDropFood(foodId);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{
        opacity: isLeaving ? 0.35 : 1,
        y: 0,
        scale: 1,
        x: isLeaving ? -50 : 0,
      }}
      exit={{ opacity: 0, scale: 0.8, y: 30 }}
      transition={{ duration: 0.35 }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative flex flex-col justify-between rounded-3xl border-3 p-3 transition-all ${
        isAngry
          ? 'bg-[#FFF1F2] border-[#F43F5E] shadow-lg ring-2 ring-[#FB7185] animate-pulse'
          : isBored
          ? 'bg-[#FFFBEB] border-[#F59E0B] shadow-md'
          : 'bg-[#FFFDF9] border-[#FFD2B8] shadow-md'
      }`}
    >
      {/* Top Bar: Customer Name & Personality & Seat Badge */}
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#F4E3D7]">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-[#3E2723] truncate max-w-[90px]">
            {customer.name}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFE37D] text-[#854D0E] border border-[#FDE047]">
            {personalityInfo.label.replace('Customer ', '')}
          </span>
        </div>
        <div className="text-[10px] font-bold text-[#A07055]">
          Meja {customer.seatIndex + 1}
        </div>
      </div>

      {/* Order Speech Bubble */}
      <div className="relative mb-2 rounded-2xl bg-white p-2.5 shadow-2xs border border-[#F4E3D7]">
        {/* Dialogue Callout */}
        <div className="text-[11px] font-extrabold text-[#785949] italic mb-1.5 flex items-center justify-between">
          <span className="truncate">{dialogueText}</span>
          <span className="text-[10px] font-bold text-[#D97706] ml-1">Rp{customer.totalBill}</span>
        </div>

        {/* Order Items with Status Badges */}
        <div className="flex flex-wrap gap-1.5">
          {customer.orderItems.map((item, idx) => {
            // Check state: is item cooking, ready in prep tray, or burnt?
            const isReadyOnTray = preparedFoods.some((pf) => pf.foodId === item.foodId);
            const isCookingNow = cookingSlots.some(
              (cs) => cs.targetFood?.id === item.foodId && cs.state === 'cooking'
            );

            return (
              <button
                key={`${item.id}-${idx}`}
                onClick={() => onItemClick && onItemClick(item.foodId)}
                title={item.name}
                className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  item.isCompleted
                    ? 'bg-[#ECFDF5] text-[#059669] line-through border border-[#A7F3D0] opacity-80'
                    : isReadyOnTray
                    ? 'bg-[#FEF08A] hover:bg-[#FDE047] text-[#854D0E] border-2 border-[#EAB308] animate-bounce cursor-pointer shadow-xs'
                    : isCookingNow
                    ? 'bg-[#FFEDD5] text-[#C2410C] border border-[#FDBA74]'
                    : 'bg-[#F4E3D7] text-[#3E2723] border border-[#E8D0C0]'
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span className="text-[11px] font-black truncate max-w-[65px]">{item.name}</span>
                {item.isCompleted ? (
                  <Check className="w-3.5 h-3.5 text-[#059669] stroke-[3]" />
                ) : isReadyOnTray ? (
                  <span className="text-[9px] font-black uppercase text-[#854D0E] bg-[#FDE047] px-1 py-0.2 rounded">
                    SIAP!
                  </span>
                ) : isCookingNow ? (
                  <Flame className="w-3 h-3 text-[#EA580C] animate-pulse" />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Bubble triangle pointer */}
        <div className="absolute -bottom-1.5 left-7 w-3 h-3 bg-white rotate-45 border-r border-b border-[#F4E3D7]" />
      </div>

      {/* Customer Avatar & Progress Bar Section */}
      <div className="flex items-center gap-2.5 mt-1">
        {/* Animated Vector Customer Avatar */}
        <div className="relative flex-shrink-0 w-13 h-13 rounded-2xl bg-white shadow-inner border-2 border-[#F4E3D7] flex items-center justify-center overflow-hidden">
          <CustomerAvatar
            personality={customer.personality}
            mood={customer.mood}
            elapsedWaitTime={customer.elapsedWaitTime}
            size="sm"
          />
        </div>

        {/* Wait Timer & Progress Meter */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-[11px] font-black mb-1">
            <span className="flex items-center gap-1 text-[#785949]">
              <Clock className="w-3.5 h-3.5 text-[#A07055]" />
              <span>{remainingSeconds}s tersisa</span>
            </span>

            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${moodBadgeColor}`}>
              {moodBadgeText}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-3 w-full bg-[#E8D9CE] rounded-full overflow-hidden p-0.5 border border-[#D8C5B6]">
            <motion.div
              className={`h-full rounded-full transition-all ${progressBarColor}`}
              style={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
      </div>

      {/* Serve Shortcut Prompt if Food is ready in serving tray */}
      {canFulfillNow && !isServed && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            const match = uncompletedItems.find((it) => readyPreparedFoodIds.includes(it.foodId));
            if (match && onItemClick) {
              onItemClick(match.foodId);
            }
          }}
          className="mt-2 w-full py-1.5 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-white text-xs font-black rounded-xl shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-all uppercase"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sajikan Pesanan Langsung!</span>
        </motion.button>
      )}

      {/* Floating Tip and Coins Animation */}
      <AnimatePresence>
        {isServed && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -25, scale: 1.2 }}
            exit={{ opacity: 0 }}
            className="absolute -top-4 right-2 bg-[#F59E0B] text-white font-black text-xs px-3 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1 z-20 pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>+{customer.totalBill} Koin</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
