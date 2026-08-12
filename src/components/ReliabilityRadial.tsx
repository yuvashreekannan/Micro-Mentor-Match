import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ShieldCheck, Info } from 'lucide-react';

interface ReliabilityRadialProps {
  score: number; // 0 - 100
  size?: number;
  showTooltip?: boolean;
  label?: string;
}

export const ReliabilityRadial: React.FC<ReliabilityRadialProps> = ({
  score,
  size = 72,
  showTooltip = true,
  label = 'Reliability',
}) => {
  const data = [
    { name: 'Reliable', value: score },
    { name: 'Missing', value: 100 - score },
  ];

  // Design tokens: Brass (#B08D57) for achievement/reliability
  const primaryColor = '#B08D57';
  const trackColor = '#E4E7EB';

  return (
    <div className="relative flex flex-col items-center group">
      <div className="relative" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={size * 0.35}
              outerRadius={size * 0.48}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              <Cell key="cell-0" fill={primaryColor} />
              <Cell key="cell-1" fill={trackColor} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs font-mono font-bold text-ink">
            {score}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-0.5">
        <span className="text-[10px] font-mono text-ink-muted uppercase">
          {label}
        </span>
        {showTooltip && (
          <div className="relative">
            <Info className="w-3 h-3 text-ink-muted hover:text-ink cursor-help" strokeWidth={1.75} />
            <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 hidden group-hover:flex flex-col w-52 p-3 bg-ink text-paper text-[11px] font-sans rounded-xl shadow-lg z-30 pointer-events-none transition-all">
              <div className="font-semibold text-brass flex items-center gap-1 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} /> Reliability Index
              </div>
              <p className="text-mist leading-relaxed">
                Calculated based on confirmed show-up rate. Users with 90%+ score maintain priority escrow eligibility.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

