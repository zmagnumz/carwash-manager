import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import VehicleListScreen from './screens/VehicleListScreen';
import AddVehicleScreen from './screens/AddVehicleScreen';
import HomeScreen from './screens/HomeScreen';
import PlanScreen from './screens/PlanScreen';
import PresetEditScreen from './screens/PresetEditScreen';
import ChemEditScreen from './screens/ChemEditScreen';
import WashScreen from './screens/WashScreen';
import CompleteScreen from './screens/CompleteScreen';
import SettingsScreen from './screens/SettingsScreen';
import HistoryDetailScreen from './screens/HistoryDetailScreen';

const SCREENS = {
  'sc-vehicle': VehicleListScreen,
  'sc-add-vehicle': AddVehicleScreen,
  'sc-home': HomeScreen,
  'sc-plan': PlanScreen,
  'sc-preset-edit': PresetEditScreen,
  'sc-chem-edit': ChemEditScreen,
  'sc-wash': WashScreen,
  'sc-complete': CompleteScreen,
  'sc-settings': SettingsScreen,
  'sc-history-detail': HistoryDetailScreen,
};

function Router() {
  const { nav, data } = useApp();
  const Screen = SCREENS[nav.current];
  const zoom = data.settings?.zoom;
  return (
    <div className="app-shell" data-zoom={zoom && zoom !== 'md' ? zoom : undefined}>
      <div className="screen active">
        {Screen && <Screen />}
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    if (window.navigator.standalone !== true) return;
    document.body.classList.add('pwa');
    const setH = () => {
      document.documentElement.style.setProperty('--app-height', window.innerHeight + 'px');
    };
    setH();
    window.addEventListener('resize', setH);
    return () => window.removeEventListener('resize', setH);
  }, []);

  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
