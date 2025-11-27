import React from 'react';

type Day = 'today' | 'tomorrow';

interface TabsProps {
  activeTab: Day;
  setActiveTab: (tab: Day) => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const getTabClass = (tabName: Day) => {
    return activeTab === tabName
      ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 hover:text-slate-700 dark:hover:text-slate-300';
  };

  return (
    <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-full flex items-center space-x-1 transition-colors">
      <button
        onClick={() => setActiveTab('today')}
        className={`w-full py-2 px-4 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${getTabClass('today')}`}
      >
        Today
      </button>
      <button
        onClick={() => setActiveTab('tomorrow')}
        className={`w-full py-2 px-4 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${getTabClass('tomorrow')}`}
      >
        Tomorrow
      </button>
    </div>
  );
};