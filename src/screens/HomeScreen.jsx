import React from 'react';
import { useApp } from '../context/AppContext';
import TabBar from '../components/TabBar';
import HomeTab from './HomeTab';
import HistoryTab from './HistoryTab';
import PresetTab from './PresetTab';
import ChemTab from './ChemTab';
import StatTab from './StatTab';

export default function HomeScreen() {
  const { currentTab } = useApp();

  const tabContent = {
    home: <HomeTab />,
    history: <HistoryTab />,
    preset: <PresetTab />,
    chem: <ChemTab />,
    stat: <StatTab />,
  };

  return (
    <>
      <div className="content" style={{ paddingTop: 'calc(16px + env(safe-area-inset-top))' }}>
        {tabContent[currentTab]}
      </div>
      <TabBar />
    </>
  );
}
