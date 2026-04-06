import React, { useState } from 'react';
import { Search, Shield, Globe, AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { getWebReputation, WebReputationResponse } from '../../services/searchService';
import '../../styles/safety/WalletCopilotSearch.css';

const WalletCopilotSearch: React.FC = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WebReputationResponse | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    // Simulate thinking/deep research
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const rep = await getWebReputation(address);
    setResult(rep);
    setLoading(false);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'trusted': return <CheckCircle2 className="sentiment-icon trusted" />;
      case 'malicious': return <AlertCircle className="sentiment-icon malicious" />;
      default: return <Info className="sentiment-icon unknown" />;
    }
  };

  return (
    <div className="wallet-copilot-search">
      <div className="search-container">
        <div className="search-header">
          <Shield className="header-icon" />
          <h2>AI Security Copilot</h2>
        </div>
        <p className="search-description">
          Search any wallet address or contract to get real-time intelligence from across the web.
        </p>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Enter address (try vitalik.eth or Badf00d...)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? <Loader2 className="spinner" /> : 'Analyze'}
            </button>
          </div>
        </form>

        {loading && (
          <div className="loading-state">
            <div className="research-status">
              <Globe className="spinning-globe" />
              <span>Scanning web sources, Etherscan labels, and community reports...</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        )}

        {result && !loading && (
          <div className={`analysis-result ${result.sentiment}`}>
            <div className="result-header">
              {getSentimentIcon(result.sentiment)}
              <h3>Reverie Intelligence Summary</h3>
            </div>
            
            <p className="summary-text">{result.summary}</p>

            {result.findings.length > 0 && (
              <div className="findings-section">
                <h4>Digital Footprint Findings</h4>
                <div className="findings-list">
                  {result.findings.map((finding, idx) => (
                    <div key={idx} className="finding-card">
                      <div className="finding-top">
                        <span className="source-tag">{finding.source}</span>
                        <span className={`reputation-badge ${finding.reputation}`}>
                          {finding.reputationSource}
                        </span>
                      </div>
                      <p className="finding-summary">{finding.summary}</p>
                      <a href={finding.url} target="_blank" rel="noopener noreferrer" className="view-link">
                        View Source
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="security-tip">
              <Info className="tip-icon" />
              <p>This intelligence is gathered from public web data and should be used as a guide, not financial advice.</p>
            </div>
          </div>
        )}
      </div>

      <div className="quick-examples">
        <span>Try:</span>
        <button onClick={() => setAddress('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')}>Vitalik Buterin</button>
        <button onClick={() => setAddress('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984')}>Uniswap V3</button>
        <button onClick={() => setAddress('0xbadf00d...phishing')}>Scam Example</button>
      </div>
    </div>
  );
};

export default WalletCopilotSearch;
