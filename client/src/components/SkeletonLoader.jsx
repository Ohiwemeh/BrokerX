import React from 'react';

export const CryptoRowSkeleton = () => (
  <div className="bg-slate-800 p-3 sm:p-4 rounded-xl border border-slate-700 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
        <div>
          <div className="h-4 w-20 bg-slate-700 rounded mb-2"></div>
          <div className="h-3 w-16 bg-slate-700 rounded"></div>
        </div>
      </div>
      <div className="h-6 w-16 bg-slate-700 rounded"></div>
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-slate-800 p-4 sm:p-5 rounded-xl border border-slate-700 animate-pulse">
    <div className="h-4 w-24 bg-slate-700 rounded mb-2"></div>
    <div className="h-8 w-32 bg-slate-700 rounded"></div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 h-64 sm:h-72 md:h-80 animate-pulse">
    <div className="h-6 w-32 bg-slate-700 rounded mb-4"></div>
    <div className="h-full bg-slate-700/50 rounded"></div>
  </div>
);
