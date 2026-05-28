const LS = k => JSON.parse(localStorage.getItem(k) || 'null');
const SS = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const DEFAULT_SETTINGS = {
  zoom: 'md',
  defaultLoc: {
    name: '워시존개러지 김포IC',
    addr: '경기도 김포시 고촌읍 김포대로451번길 10',
  },
};

export function loadData() {
  return {
    vehicles: LS('cw2_vehicles') || [],
    history: LS('cw2_history') || [],
    cPresets: LS('cw2_cpresets') || [],
    bPresets: LS('cw2_bpresets') || {},
    chemicals: LS('cw2_chemicals') || [],
    locations: LS('cw2_locations') || [],
    defaultPreset: LS('cw2_defpreset') || null,
    customCats: LS('cw2_customcats') || [],
    settings: { ...DEFAULT_SETTINGS, ...(LS('cw2_settings') || {}) },
  };
}

export function persistData(D) {
  SS('cw2_vehicles', D.vehicles);
  SS('cw2_history', D.history);
  SS('cw2_cpresets', D.cPresets);
  SS('cw2_bpresets', D.bPresets || {});
  SS('cw2_chemicals', D.chemicals);
  SS('cw2_locations', D.locations);
  SS('cw2_defpreset', D.defaultPreset);
  SS('cw2_customcats', D.customCats || []);
  SS('cw2_settings', D.settings || DEFAULT_SETTINGS);
}
