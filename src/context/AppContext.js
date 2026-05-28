import React, { createContext, useCallback, useContext, useState } from 'react';
import { loadData, persistData } from '../utils/storage';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [data, setData] = useState(() => loadData());
  const [nav, setNav] = useState(() => {
    const d = loadData();
    return d.vehicles.length > 0
      ? { current: 'sc-home', stack: ['sc-home'] }
      : { current: 'sc-add-vehicle', stack: ['sc-add-vehicle'] };
  });
  const [currentVehicle, setCurrentVehicle] = useState(0);
  const [currentTab, setCurrentTab] = useState('home');
  const [wash, setWash] = useState(null);
  const [chemEditIndex, setChemEditIndex] = useState(null);
  const [presetEditIndex, setPresetEditIndex] = useState(null); // null = new
  const [presetEditBuiltinId, setPresetEditBuiltinId] = useState(null);

  const saveData = useCallback((newData) => {
    setData(newData);
    persistData(newData);
  }, []);

  const go = useCallback((id) => {
    setNav(prev => ({
      current: id,
      stack: prev.stack[prev.stack.length - 1] !== id ? [...prev.stack, id] : prev.stack,
    }));
  }, []);

  const back = useCallback(() => {
    setNav(prev => {
      if (prev.stack.length <= 1) return prev;
      const newStack = prev.stack.slice(0, -1);
      return { current: newStack[newStack.length - 1], stack: newStack };
    });
  }, []);

  const goHome = useCallback(() => {
    setNav({ current: 'sc-home', stack: ['sc-home'] });
    setCurrentTab('home');
  }, []);

  return (
    <AppContext.Provider value={{
      data, saveData,
      nav, go, back, goHome,
      currentVehicle, setCurrentVehicle,
      currentTab, setCurrentTab,
      wash, setWash,
      chemEditIndex, setChemEditIndex,
      presetEditIndex, setPresetEditIndex,
      presetEditBuiltinId, setPresetEditBuiltinId,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
