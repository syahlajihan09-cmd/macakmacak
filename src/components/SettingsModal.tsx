import React from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, HelpCircle, X, Check } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface SettingsModalProps {
  isMuted: boolean;
  sfxVolume: number;
  musicVolume: number;
  onToggleMute: (muted: boolean) => void;
  onChangeSfxVolume: (vol: number) => void;
  onChangeMusicVolume: (vol: number) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isMuted,
  sfxVolume,
  musicVolume,
  onToggleMute,
  onChangeSfxVolume,
  onChangeMusicVolume,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md bg-[#FFFDF9] border-4 border-[#FF8A3D] rounded-3xl p-6 text-[#3E2723] shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F4E3D7]">
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-[#FF8A3D]">
              Opsi Game
            </div>
            <h3 className="text-2xl font-black text-[#3E2723]">PENGATURAN & PANDUAN</h3>
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

        {/* Audio Volume Controls */}
        <div className="bg-[#FFF8F0] p-4 rounded-2xl border-2 border-[#FFE2CF] space-y-4 mb-5">
          <div className="text-xs font-black uppercase text-[#E55934] tracking-wider">Audio & Suara</div>

          {/* Mute toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
              <span className="text-sm font-bold text-[#3E2723]">Mute Semua Audio</span>
            </div>
            <button
              onClick={() => onToggleMute(!isMuted)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                isMuted ? 'bg-[#E8D9CE]' : 'bg-[#10B981]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                  isMuted ? 'left-0.5' : 'left-6.5'
                }`}
              />
            </button>
          </div>

          {/* SFX Volume */}
          <div>
            <div className="flex justify-between text-xs font-bold text-[#785949] mb-1">
              <span>Efek Suara (Memasak, Wajan, Bel)</span>
              <span className="text-[#FF8A3D] font-black">{Math.round(sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={sfxVolume}
              disabled={isMuted}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChangeSfxVolume(val);
                soundEngine.playDing();
              }}
              className="w-full accent-[#FF8A3D] bg-[#E8D9CE] rounded-lg cursor-pointer"
            />
          </div>

          {/* Music Volume */}
          <div>
            <div className="flex justify-between text-xs font-bold text-[#785949] mb-1">
              <span>Musik Restoran Cafe</span>
              <span className="text-[#FF8A3D] font-black">{Math.round(musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              disabled={isMuted}
              onChange={(e) => onChangeMusicVolume(parseFloat(e.target.value))}
              className="w-full accent-[#FF8A3D] bg-[#E8D9CE] rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Game Rules & Tips Accordion */}
        <div className="bg-[#FFF8F0] p-4 rounded-2xl border-2 border-[#FFE2CF] space-y-2.5 mb-5">
          <div className="text-xs font-black uppercase text-[#E55934] tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#FF8A3D]" />
            Aturan Main MASAK MASAK
          </div>

          <ul className="text-xs space-y-2 text-[#785949]">
            <li className="flex items-start gap-1.5">
              <span className="text-[#FF8A3D] font-bold">•</span>
              <span>
                <strong>Customer Beruntun:</strong> Customer masuk setiap beberapa detik. Atur prioritas pesanan dengan tepat!
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#10B981] font-bold">•</span>
              <span>
                <strong>Waktu Tunggu 30 Detik:</strong> 0–10s (Hijau/Sabar), 10–20s (Kuning/Bosan), 20–30s (Merah/Marah!).
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#DC2626] font-bold">•</span>
              <span>
                <strong>Maksimal 5 Customer Kabur:</strong> Customer ke-6 yang pergi akan memicu <strong>GAME OVER</strong>.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#D97706] font-bold">•</span>
              <span>
                <strong>Makanan Gosong:</strong> Angkat masakan tepat saat matang (DING!). Jika gosong, segera seret/buang ke tong sampah.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-[#0284C7] font-bold">•</span>
              <span>
                <strong>Drag and Drop atau Klik:</strong> Anda bisa klik atau drag bahan ke alat masak, dan sajikan ke customer dengan seret atau klik langsung!
              </span>
            </li>
          </ul>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="w-full py-3 bg-gradient-to-r from-[#FF8A3D] to-[#E55934] hover:from-[#FFA05C] hover:to-[#FF8A3D] active:scale-95 text-white font-black text-sm rounded-2xl cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          <span>SIMPAN & TUTUP</span>
        </button>
      </motion.div>
    </div>
  );
};
