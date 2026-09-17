import React from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, LogOut } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings?: () => void;
  onExitLevel: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onExitLevel,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85 }}
        className="w-full max-w-xs bg-[#FFFDF9] border-4 border-[#FF8A3D] rounded-3xl p-6 text-[#3E2723] shadow-2xl text-center"
      >
        <div className="text-3xl mb-1">⏸️</div>
        <h3 className="text-2xl font-black tracking-tight text-[#3E2723] mb-1">
          GAME PAUSED
        </h3>
        <p className="text-xs text-[#785949] mb-5">Permainan dihentikan sementara</p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => {
              soundEngine.playClick();
              onResume();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF8A3D] to-[#E55934] hover:from-[#FFA05C] hover:to-[#FF8A3D] active:scale-95 text-white font-black text-sm cursor-pointer shadow-md transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RESUME</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onRestart();
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-white hover:bg-[#FFF0E0] active:scale-95 text-[#3E2723] font-black text-sm border-2 border-[#FFD2B8] cursor-pointer shadow-xs transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onExitLevel();
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#FEE2E2] hover:bg-[#FCA5A5] active:scale-95 text-[#DC2626] font-black text-sm border-2 border-[#FCA5A5] cursor-pointer shadow-xs transition-all mt-1"
          >
            <LogOut className="w-4 h-4" />
            <span>EXIT</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
