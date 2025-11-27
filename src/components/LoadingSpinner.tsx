import React from 'react';
import { SparklesIcon } from './IconComponents';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="text-center">
      <SparklesIcon className="w-16 h-16 text-sky-500 mx-auto animate-pulse" />
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Generating your personalized plan...</p>
      <p className="text-sm text-slate-400 dark:text-slate-500">This may take a moment.</p>
    </div>
  );
};
