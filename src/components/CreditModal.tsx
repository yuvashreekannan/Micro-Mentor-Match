import React from 'react';
import { X, Plus, Sparkles, Coins } from 'lucide-react';
import { CreditSystemCard } from './CreditSystemCard';
import { useBridge } from '../context/BridgeContext';

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditModal: React.FC<CreditModalProps> = ({ isOpen, onClose }) => {
  const { addCredits } = useBridge();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-paper rounded-[24px] border border-mist max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-mist-subtle hover:bg-mist text-ink-muted transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={1.75} />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brass-light border border-brass-border text-brass text-xs font-mono font-medium uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5" strokeWidth={1.75} />
            Credit Balance Management
          </div>
          <h2 className="text-2xl font-display font-medium text-ink">
            Escrow Credits & Ledger
          </h2>
          <p className="text-xs text-ink-subtle font-sans">
            1 Credit is held in escrow when booking a 15-minute ask. Attend to get refunded + earn a +0.25 bonus!
          </p>
        </div>

        {/* Embedded Credit Card Ledger */}
        <CreditSystemCard />

        {/* Quick Top-up Affordance for Demo */}
        <div className="p-4 rounded-xl bg-signal-light border border-signal-border flex flex-col sm:flex-row items-center justify-between gap-3 text-ink">
          <div>
            <h4 className="font-display font-medium text-sm text-signal flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brass" strokeWidth={1.75} />
              Need additional credits for practice?
            </h4>
            <p className="text-xs text-ink-subtle mt-0.5 font-sans">
              Claim 2.0 demo credits instantly to continue requesting 15-minute asks.
            </p>
          </div>
          <button
            onClick={() => addCredits(2.0, 'Demo Credit Claim')}
            className="px-4 py-2 rounded-xl bg-signal hover:bg-signal-hover text-paper text-xs font-medium transition-colors shadow-2xs flex items-center gap-1.5 flex-shrink-0"
          >
            <Plus className="w-4 h-4" strokeWidth={1.75} />
            <span>Claim +2.00 Credits</span>
          </button>
        </div>
      </div>
    </div>
  );
};
