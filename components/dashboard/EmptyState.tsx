'use client';

import { FolderX } from 'lucide-react';

export interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({
  message = 'No activity found for this timeframe',
}: EmptyStateProps) {
  return (
    <div className="w-full h-full min-h-[250px] flex flex-col items-center justify-center p-8 bg-white dark:bg-[#0a0a0a] rounded-xl border border-black/5 dark:border-[rgba(255,255,255,0.08)] transition-colors">
      <div className="p-4 bg-gray-50 dark:bg-[#111] rounded-full mb-4 border border-black/5 dark:border-[rgba(255,255,255,0.06)] shadow-sm">
        <FolderX className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">{message}</p>
    </div>
  );
}
