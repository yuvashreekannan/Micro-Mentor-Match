import React from 'react';
import {
  Coins,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useBridge } from '../context/BridgeContext';

export const CreditSystemCard: React.FC = () => {
  const { activeStudent, creditTransactions } = useBridge();

  const userTxs = creditTransactions.filter((tx) => tx.userId === activeStudent.id);

  // Active cooldown status calculation
  const isCooldownActive = activeStudent.noShowCount >= 3;

  return (
    <div className="bg-paper-card rounded-[20px] border border-mist p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(20,33,61,0.05)] space-y-6">
      {/* Top Banner - Brass Achievement Ledger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-[16px] bg-brass-light border border-brass-border text-ink">
        <div>
          <div className="flex items-center gap-1.5 text-brass text-xs font-mono font-medium uppercase tracking-wider mb-1">
            <Coins className="w-4 h-4 text-brass" strokeWidth={1.75} /> Credit Escrow Ledger
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-medium text-ink">
            {activeStudent.credits.toFixed(2)} Available Credits
          </h3>
          <p className="text-ink-subtle text-xs mt-1">
            Escrow-backed attendance guarantee: 1 credit per 15-minute ask.
          </p>
        </div>

        {/* Cooldown Status Badge */}
        {isCooldownActive ? (
          <div className="px-3.5 py-2 rounded-xl bg-coral-light border border-coral-border text-coral text-xs font-mono font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-coral" strokeWidth={1.75} />
            <div>
              <p className="font-semibold text-coral">Cooldown Active</p>
              <p className="text-[10px] text-coral font-sans">3 No-Shows Recorded</p>
            </div>
          </div>
        ) : (
          <div className="px-3.5 py-2 rounded-xl bg-paper border border-brass-border text-ink text-xs font-mono font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brass" strokeWidth={1.75} />
            <div>
              <p className="font-medium text-ink font-sans">Account Good Standing</p>
              <p className="text-[10px] text-ink-muted">{activeStudent.noShowCount}/3 No-Shows</p>
            </div>
          </div>
        )}
      </div>

      {/* Horizontal Credit Lifecycle Stepper */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brass" strokeWidth={1.75} />
          Credit Escrow Flow
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-sans">
          <div className="p-3 rounded-xl bg-mist-subtle border border-mist">
            <span className="font-semibold text-ink block">1. Booked</span>
            <span className="text-[11px] text-ink-muted">Select 15-min slot</span>
          </div>
          <div className="p-3 rounded-xl bg-brass-light border border-brass-border">
            <span className="font-semibold text-brass block">2. Held in Escrow</span>
            <span className="text-[11px] text-ink-subtle">1 Credit held safely</span>
          </div>
          <div className="p-3 rounded-xl bg-signal-light border border-signal-border">
            <span className="font-semibold text-signal block">3. Show Up</span>
            <span className="text-[11px] text-ink-subtle">Credit refunded + 0.25 bonus</span>
          </div>
          <div className="p-3 rounded-xl bg-coral-light border border-coral-border">
            <span className="font-semibold text-coral block">4. No-Show</span>
            <span className="text-[11px] text-coral">Credit forfeited to mentor</span>
          </div>
        </div>
      </div>

      {/* Credit Transactions Log */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-mono text-ink-muted uppercase tracking-wider">
          Ledger Transactions
        </h4>

        {userTxs.length === 0 ? (
          <p className="text-xs text-ink-muted italic">No credit transactions recorded yet.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {userTxs.map((tx) => {
              const isPositive = tx.amount > 0;
              const isNegative = tx.amount < 0;

              return (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl border border-mist bg-paper/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isPositive
                          ? 'bg-signal-light text-signal'
                          : isNegative
                          ? 'bg-coral-light text-coral'
                          : 'bg-brass-light text-brass'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowDownLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-ink">{tx.type}</span>
                      <p className="text-[11px] text-ink-muted">{tx.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono font-medium text-xs ${
                        isPositive
                          ? 'text-signal'
                          : isNegative
                          ? 'text-coral'
                          : 'text-ink-subtle'
                      }`}
                    >
                      {isPositive ? `+${tx.amount.toFixed(2)}` : tx.amount.toFixed(2)} Credits
                    </span>
                    <p className="text-[10px] font-mono text-ink-muted">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

