/**
 * TradingView Ticker Tape Component
 * 
 * A reusable React component that dynamically injects the TradingView Ticker Tape widget
 * with base market indices and industry-specific tickers.
 */

'use client';

import React, { useEffect, useRef } from 'react';

interface TickerItem {
  proName: string;
  title: string;
}

interface TradingViewTickerProps {
  industry?: string;
  colorTheme?: 'light' | 'dark';
  className?: string;
}

// Industry-specific ticker mappings
const INDUSTRY_TICKERS: Record<string, TickerItem[]> = {
  technology: [
    { proName: 'NASDAQ:AAPL', title: 'Apple' },
    { proName: 'NASDAQ:MSFT', title: 'Microsoft' },
    { proName: 'NASDAQ:NVDA', title: 'Nvidia' },
    { proName: 'NASDAQ:GOOGL', title: 'Alphabet' },
    { proName: 'NASDAQ:TSLA', title: 'Tesla' },
    { proName: 'NASDAQ:META', title: 'Meta' },
    { proName: 'NASDAQ:AMZN', title: 'Amazon' },
    { proName: 'NASDAQ:ADBE', title: 'Adobe' }
  ],
  retail: [
    { proName: 'NYSE:WMT', title: 'Walmart' },
    { proName: 'NASDAQ:AMZN', title: 'Amazon' },
    { proName: 'NYSE:TGT', title: 'Target' },
    { proName: 'NYSE:HD', title: 'Home Depot' },
    { proName: 'NYSE:COST', title: 'Costco' },
    { proName: 'NYSE:LOW', title: 'Lowe\'s' },
    { proName: 'NYSE:BJ', title: 'BJ\'s Wholesale' },
    { proName: 'NYSE:KR', title: 'Kroger' }
  ],
  healthcare: [
    { proName: 'NYSE:JNJ', title: 'Johnson & Johnson' },
    { proName: 'NYSE:PFE', title: 'Pfizer' },
    { proName: 'NYSE:UNH', title: 'UnitedHealth' },
    { proName: 'NYSE:ABBV', title: 'AbbVie' },
    { proName: 'NYSE:MRK', title: 'Merck' },
    { proName: 'NYSE:TMO', title: 'Thermo Fisher' },
    { proName: 'NYSE:ABT', title: 'Abbott' },
    { proName: 'NYSE:CVS', title: 'CVS Health' }
  ],
  finance: [
    { proName: 'NYSE:JPM', title: 'JPMorgan Chase' },
    { proName: 'NYSE:BAC', title: 'Bank of America' },
    { proName: 'NYSE:WFC', title: 'Wells Fargo' },
    { proName: 'NYSE:GS', title: 'Goldman Sachs' },
    { proName: 'NYSE:MS', title: 'Morgan Stanley' },
    { proName: 'NYSE:C', title: 'Citigroup' },
    { proName: 'NYSE:USB', title: 'U.S. Bancorp' },
    { proName: 'NYSE:PNC', title: 'PNC Financial' }
  ],
  energy: [
    { proName: 'NYSE:XOM', title: 'ExxonMobil' },
    { proName: 'NYSE:CVX', title: 'Chevron' },
    { proName: 'NYSE:COP', title: 'ConocoPhillips' },
    { proName: 'NYSE:EOG', title: 'EOG Resources' },
    { proName: 'NYSE:SLB', title: 'Schlumberger' },
    { proName: 'NYSE:PSX', title: 'Phillips 66' },
    { proName: 'NYSE:MPC', title: 'Marathon Petroleum' },
    { proName: 'NYSE:VLO', title: 'Valero Energy' }
  ],
  consumer: [
    { proName: 'NYSE:PG', title: 'Procter & Gamble' },
    { proName: 'NYSE:KO', title: 'Coca-Cola' },
    { proName: 'NYSE:PEP', title: 'PepsiCo' },
    { proName: 'NYSE:ULTA', title: 'Ulta Beauty' },
    { proName: 'NYSE:NKE', title: 'Nike' },
    { proName: 'NYSE:SBUX', title: 'Starbucks' },
    { proName: 'NYSE:MCD', title: 'McDonald\'s' },
    { proName: 'NYSE:YUM', title: 'Yum! Brands' }
  ],
  industrial: [
    { proName: 'NYSE:BA', title: 'Boeing' },
    { proName: 'NYSE:CAT', title: 'Caterpillar' },
    { proName: 'NYSE:GE', title: 'General Electric' },
    { proName: 'NYSE:MMM', title: '3M' },
    { proName: 'NYSE:UPS', title: 'United Parcel Service' },
    { proName: 'NYSE:FDX', title: 'FedEx' },
    { proName: 'NYSE:RTX', title: 'Raytheon Technologies' },
    { proName: 'NYSE:EMR', title: 'Emerson Electric' }
  ],
  telecommunications: [
    { proName: 'NYSE:VZ', title: 'Verizon' },
    { proName: 'NYSE:T', title: 'AT&T' },
    { proName: 'NYSE:TMUS', title: 'T-Mobile' },
    { proName: 'NYSE:CMCSA', title: 'Comcast' },
    { proName: 'NYSE:CHTR', title: 'Charter Communications' },
    { proName: 'NYSE:ORAN', title: 'Orange' },
    { proName: 'NYSE:DTEGY', title: 'Deutsche Telekom' },
    { proName: 'NYSE:VOD', title: 'Vodafone' }
  ]
};

// Base tickers that are always included
const BASE_TICKERS: TickerItem[] = [
  { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500 Index' },
  { proName: 'FOREXCOM:DJI', title: 'Dow Jones' }
];

const TradingViewTicker: React.FC<TradingViewTickerProps> = ({
  industry,
  colorTheme = 'light',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Clean up previous script if it exists
    if (scriptRef.current) {
      scriptRef.current.remove();
      scriptRef.current = null;
    }

    // Get industry-specific tickers
    const industryTickers = industry ? INDUSTRY_TICKERS[industry.toLowerCase()] || [] : [];
    
    // Combine base tickers with industry tickers
    const allTickers = [...BASE_TICKERS, ...industryTickers];

    // Create the script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: allTickers,
      colorTheme,
      isTransparent: false,
      displayMode: 'adaptive',
      locale: 'en'
    });

    // Add the script to the container
    if (containerRef.current) {
      containerRef.current.appendChild(script);
      scriptRef.current = script;
    }

    // Cleanup function
    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
    };
  }, [industry, colorTheme]);

  // Don't render anything on server-side
  if (typeof window === 'undefined') {
    return (
      <div 
        ref={containerRef}
        className={`tradingview-widget-container ${className}`}
        style={{ height: '60px' }}
      >
        <div className="tradingview-widget-container__widget" style={{ height: '100%' }}>
          <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
            <span className="text-gray-500 dark:text-gray-400">
              Loading market data...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`tradingview-widget-container ${className}`}
    >
      <div className="tradingview-widget-container__widget" style={{ height: '100%' }}>
        {/* TradingView widget will be injected here */}
      </div>
    </div>
  );
};

export default TradingViewTicker; 