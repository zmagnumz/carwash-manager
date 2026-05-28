import React from 'react';
import { useApp } from '../context/AppContext';
import TopBar from '../components/TopBar';
import TabBar from '../components/TabBar';
import HomeTab from './HomeTab';
import HistoryTab from './HistoryTab';
import PresetTab from './PresetTab';
import ChemTab from './ChemTab';
import StatTab from './StatTab';

export default function HomeScreen() {
  const { data, currentVehicle, currentTab, go } = useApp();
  const v = data.vehicles[currentVehicle];

  const tabContent = {
    home: <HomeTab />,
    history: <HistoryTab />,
    preset: <PresetTab />,
    chem: <ChemTab />,
    stat: <StatTab />,
  };

  return (
    <>
      <TopBar
        title={v?.nick || '홈'}
        left={
          <button className="btn-icon" onClick={() => go('sc-vehicle')} aria-label="차량 선택" style={{ fontSize: 22 }}>
            {v?.emoji || '🚗'}
          </button>
        }
      />
      <div className="content">{tabContent[currentTab]}</div>
      <TabBar />
    </>
  );
}
