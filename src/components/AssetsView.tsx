import React, { useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownUp, ArrowUpRight, Search } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import {
  formatFiat,
  formatTokenAmount,
  NETWORKS,
  shortenAddress,
} from '../data/initialWalletData';
import { APPLE_REDUCED_CROSSFADE, APPLE_SPRING_NAV_PUSH } from '../motion/appleMotion';
import type { NetworkId } from '../types/wallet';
import { SlidingSegmentedControl, type SegmentedOption } from './SlidingSegmentedControl';
import { TokenIcon } from './TokenIcon';

type NetworkFilter = 'all' | NetworkId;

const NETWORK_OPTIONS: Array<SegmentedOption<NetworkFilter>> = [
  { value: 'all', label: 'All networks' },
  { value: 'ethereum', label: NETWORKS.ethereum.shortName },
  { value: 'base', label: NETWORKS.base.shortName },
  { value: 'arbitrum', label: NETWORKS.arbitrum.shortName },
  { value: 'optimism', label: NETWORKS.optimism.shortName },
];

const NETWORK_ORDER: Record<NetworkFilter, number> = {
  all: 0,
  ethereum: 1,
  base: 2,
  arbitrum: 3,
  optimism: 4,
};

export function AssetsView() {
  const { assets, mode, settings, totalPortfolioUsd, openActionDrawer } = useWallet();
  const prefersReducedMotion = useReducedMotion();
  const [search, setSearch] = useState('');
  const [networkFilter, setNetworkFilter] = useState<NetworkFilter>('all');
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const prevFilterRef = useRef<NetworkFilter>('all');

  const handleNetworkChange = (next: NetworkFilter) => {
    if (next === prevFilterRef.current) return;
    setSlideDirection(NETWORK_ORDER[next] > NETWORK_ORDER[prevFilterRef.current] ? 1 : -1);
    prevFilterRef.current = next;
    setNetworkFilter(next);
  };

  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...assets]
      .filter((a) => (networkFilter === 'all' ? true : a.network === networkFilter))
      .filter((a) =>
        query
          ? a.name.toLowerCase().includes(query) ||
            a.symbol.toLowerCase().includes(query) ||
            NETWORKS[a.network].name.toLowerCase().includes(query)
          : true
      )
      .sort((a, b) => b.balance * b.priceUsd - a.balance * a.priceUsd);
  }, [assets, networkFilter, search]);

  const filteredTotalUsd = useMemo(
    () => filteredAssets.reduce((sum, a) => sum + a.balance * a.priceUsd, 0),
    [filteredAssets]
  );

  const panelTransition = prefersReducedMotion ? APPLE_REDUCED_CROSSFADE : APPLE_SPRING_NAV_PUSH;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SlidingSegmentedControl
          layoutId="assetsNetworkThumb"
          options={NETWORK_OPTIONS}
          value={networkFilter}
          onChange={handleNetworkChange}
          ariaLabel="Filter assets by network"
        />

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#5C606A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by token or network…"
            aria-label="Filter assets"
            className="w-full h-10 pl-9 pr-3 glass-control text-sm text-[#F7F8FA] placeholder:text-[#5C606A] focus:border-[#2DF5C6]/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Assets Table with Directional Sliding Transition */}
      <section className="surface-panel overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#8E929B]">
            Showing <span className="text-[#F7F8FA] font-mono tabular-nums">{filteredAssets.length}</span>{' '}
            {filteredAssets.length === 1 ? 'position' : 'positions'}
            <span aria-hidden="true"> · </span>
            Subtotal{' '}
            <span className="text-[#F7F8FA] font-mono tabular-nums">
              {formatFiat(filteredTotalUsd, settings.currency)}
            </span>
          </div>
          {mode === 'sentinel' && (
            <span className="text-xs text-[#19C8FF]">
              Sentinel view: showing verified contract addresses & staking yield
            </span>
          )}
        </div>

        <motion.div
          key={networkFilter}
          initial={prefersReducedMotion ? { opacity: 0 } : { x: slideDirection * 22, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={panelTransition}
        >
            {filteredAssets.length === 0 ? (
              <div className="px-6 py-16 text-center space-y-3">
                <p className="text-sm font-medium text-[#F7F8FA]">No assets match your current filter</p>
                <p className="text-xs text-[#8E929B]">
                  Try clearing your search query or switching back to all networks.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    handleNetworkChange('all');
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-medium glass-btn text-[#F7F8FA]"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-[11px] font-medium text-[#5C606A]">
                      <th className="py-3 pl-5 pr-3">Asset</th>
                      <th className="py-3 px-3 text-right">Price</th>
                      <th className="py-3 px-3 text-right">24h</th>
                      <th className="py-3 px-3 text-right">Balance</th>
                      <th className="py-3 px-3 text-right">Portfolio share</th>
                      <th className="py-3 pl-3 pr-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {filteredAssets.map((asset) => {
                      const valueUsd = asset.balance * asset.priceUsd;
                      const sharePct = totalPortfolioUsd > 0 ? (valueUsd / totalPortfolioUsd) * 100 : 0;
                      const net = NETWORKS[asset.network];
                      return (
                        <tr key={asset.id} className="hover:bg-white/[0.025] transition-colors">
                          <td className="py-3.5 pl-5 pr-3">
                            <div className="flex items-center gap-3">
                              <TokenIcon symbol={asset.symbol} size={34} />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-[#F7F8FA]">{asset.name}</p>
                                <p className="text-xs text-[#8E929B] font-mono">
                                  {asset.symbol} · {net.shortName}
                                  {mode === 'sentinel' ? ` · ${shortenAddress(asset.contractAddress)}` : ''}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono tabular-nums text-xs text-[#D2D5DC] whitespace-nowrap">
                            {formatFiat(asset.priceUsd, settings.currency)}
                          </td>
                          <td
                            className={`py-3.5 px-3 text-right font-mono tabular-nums text-xs whitespace-nowrap ${
                              asset.change24hPct >= 0 ? 'text-[#2DF5C6]' : 'text-[#FF5B5B]'
                            }`}
                          >
                            {asset.change24hPct >= 0 ? '+' : ''}
                            {asset.change24hPct.toFixed(2)}%
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                            <p className="text-sm font-medium text-[#F7F8FA]">
                              {formatFiat(valueUsd, settings.currency)}
                            </p>
                            <p className="text-xs text-[#8E929B]">
                              {formatTokenAmount(asset.balance)} {asset.symbol}
                            </p>
                          </td>
                          <td className="py-3.5 px-3 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    mode === 'sentinel' ? 'bg-[#19C8FF]' : 'bg-[#2DF5C6]'
                                  }`}
                                  style={{ width: `${Math.max(3, sharePct)}%` }}
                                />
                              </div>
                              <span className="font-mono tabular-nums text-xs text-[#8E929B] w-11 text-right">
                                {sharePct.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openActionDrawer('send', asset.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium glass-btn text-[#F7F8FA]"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                <span>Send</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => openActionDrawer('swap', asset.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium glass-btn text-[#D2D5DC]"
                              >
                                <ArrowDownUp className="w-3.5 h-3.5" />
                                <span>Swap</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
        </motion.div>
      </section>
    </div>
  );
}
