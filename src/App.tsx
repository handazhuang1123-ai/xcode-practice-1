import React, { useState } from 'react';
import { IPhoneShell } from './components/IPhoneShell';
import { HomeView } from './components/HomeView';
import { DraftDetailSheet } from './components/DraftDetailSheet';
import { INITIAL_DRAFTS } from './utils/draft';
import { DraftLogItem } from './types';

export default function App() {
  const [drafts] = useState<DraftLogItem[]>(INITIAL_DRAFTS);
  const [selectedDraft, setSelectedDraft] = useState<DraftLogItem | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const handleSelectDraft = (draft: DraftLogItem) => {
    setSelectedDraft(draft);
  };

  const handleCloseSheet = () => {
    setSelectedDraft(null);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <IPhoneShell isDarkMode={isDarkMode}>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        {/* Screen 1: Home View with Linked Filter & Dark Mode Toggle */}
        <HomeView
          drafts={drafts}
          onSelectDraft={handleSelectDraft}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />

        {/* Screen 2: Draft Detail Modal (Slides up covering 85% of phone screen) */}
        {selectedDraft && (
          <DraftDetailSheet
            draft={selectedDraft}
            onClose={handleCloseSheet}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </IPhoneShell>
  );
}
