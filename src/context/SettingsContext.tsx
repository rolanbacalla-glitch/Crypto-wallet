import React, { createContext, useContext, useState } from 'react';

export type UserPersona = 'beginner' | 'advanced';

interface SafetySettings {
  slippage: number;
  gasLimit: 'safe' | 'normal' | 'fast';
  autoBlockDNS: boolean;
}

interface SettingsContextType {
  persona: UserPersona;
  setPersona: (p: UserPersona) => void;
  settings: SafetySettings;
  updateSettings: (s: Partial<SafetySettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [persona, setPersonaState] = useState<UserPersona>(() => {
    const saved = localStorage.getItem('nest_persona');
    return (saved as UserPersona) || 'beginner';
  });

  const [settings, setSettings] = useState<SafetySettings>(() => {
    const saved = localStorage.getItem('nest_safety_settings');
    if (saved) return JSON.parse(saved);
    
    // Default safety profiles
    return persona === 'beginner' 
      ? { slippage: 0.1, gasLimit: 'safe', autoBlockDNS: true }
      : { slippage: 0.5, gasLimit: 'normal', autoBlockDNS: true };
  });

  const setPersona = (p: UserPersona) => {
    setPersonaState(p);
    localStorage.setItem('nest_persona', p);
    
    const newDefaults: SafetySettings = p === 'beginner' 
      ? { slippage: 0.1, gasLimit: 'safe', autoBlockDNS: true }
      : { slippage: 0.5, gasLimit: 'normal', autoBlockDNS: true };
    setSettings(newDefaults);
  };

  const updateSettings = (s: Partial<SafetySettings>) => {
    const newSettings = { ...settings, ...s };
    setSettings(newSettings);
    localStorage.setItem('nest_safety_settings', JSON.stringify(newSettings));
  };

  return (
    <SettingsContext.Provider value={{ persona, setPersona, settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
