import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import './styles/theme.css';

import { AssetProvider } from './context/AssetContext';

import DashboardPage from './components/dashboard/DashboardPage';
import MarketPage from './components/market/MarketPage';
import TradePage from './components/trade/TradePage';
import PortfolioPage from './components/portfolio/PortfolioPage';
import AssetsPage from './components/assets/AssetsPage';
import AuditPage from './components/audit/AuditPage';
import SafetyCentrePage from './components/safety/SafetyCentrePage';

function App() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [profile, setProfile] = useState<'beginner' | 'advanced'>('beginner');

  const handleOnboardingComplete = (data?: { profile?: 'beginner' | 'advanced' }) => {
    if (data?.profile) setProfile(data.profile);
    setHasOnboarded(true);
  };

  return (
    <AssetProvider>
      <Router>
        <Routes>
          <Route 
            path="/onboarding" 
            element={hasOnboarded ? <Navigate to="/" /> : <OnboardingWizard onComplete={handleOnboardingComplete} />} 
          />
          
          <Route path="/" element={hasOnboarded ? <MainLayout /> : <Navigate to="/onboarding" />}>
            <Route index element={<DashboardPage profile={profile} />} />
            <Route path="market" element={<MarketPage />} />
            <Route path="trade" element={<TradePage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="assets" element={<AssetsPage />} />
            <Route path="audit" element={<AuditPage />} />
            <Route path="safety" element={<SafetyCentrePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Router>
    </AssetProvider>
  );
}

export default App;
