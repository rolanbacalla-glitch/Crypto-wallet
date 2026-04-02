import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import { AssetProvider } from './context/AssetContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/auth/LoginPage';
import DashboardPage from './components/dashboard/DashboardPage';
import MarketPage from './components/market/MarketPage';
import TradePage from './components/trade/TradePage';
import PortfolioPage from './components/portfolio/PortfolioPage';
import AssetsPage from './components/assets/AssetsPage';
import AuditPage from './components/audit/AuditPage';
import SafetyCentrePage from './components/safety/SafetyCentrePage';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import type { UserPersona } from './context/SettingsContext';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem('nest_onboarded') === 'true';
  });

  const { setPersona } = useSettings();

  const handleOnboardingComplete = (data?: { profile?: string }) => {
    if (data?.profile) {
      setPersona(data.profile as UserPersona);
    }
    setHasOnboarded(true);
    localStorage.setItem('nest_onboarded', 'true');
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (!hasOnboarded) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  return (
    <AssetProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="market" element={<MarketPage />} />
          <Route path="trade" element={<TradePage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="safety" element={<SafetyCentrePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </AssetProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
