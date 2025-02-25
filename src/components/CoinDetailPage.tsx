import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './CoinDetailPage.css';
import takeoffLogo from '../assets/takeoff-logo.png';

// Define TradingView widget declaration
declare global {
  interface Window {
    TradingView: any;
  }
}

// USDC logo URL
const usdcLogoUrl = "https://cryptologos.cc/logos/usd-coin-usdc-logo.png";

const CoinDetailPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { project, logoSrc } = location.state || {};
  
  // States for swap interface
  const [fromAmount, setFromAmount] = useState<string>('0');
  const [toAmount, setToAmount] = useState<string>('0');
  const [activePercentage, setActivePercentage] = useState<string>('');
  const [swapDirection, setSwapDirection] = useState<boolean>(false); // false = coin to USDC, true = USDC to coin
  const [sliderValue, setSliderValue] = useState<number>(0);
  
  // Watchlist states
  const [showWatchlist, setShowWatchlist] = useState<boolean>(false);
  const [isInWatchlist, setIsInWatchlist] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  
  // Dummy data for top gainers
  const topGainers = [
    { symbol: "TOKEN A", price: 193, change: 30 },
    { symbol: "TOKEN B", price: 33, change: 30 },
    { symbol: "TOKEN C", price: 193, change: 30 },
    { symbol: "TOKEN D", price: 193, change: 30 },
    { symbol: "TOKEN E", price: 193, change: 30 },
    { symbol: "TOKEN F", price: 45, change: 28 },
    { symbol: "TOKEN G", price: 76, change: 25 },
    { symbol: "TOKEN H", price: 112, change: 22 },
    { symbol: "TOKEN I", price: 89, change: 20 },
    { symbol: "TOKEN J", price: 37, change: 18 },
  ];
  
  // Get watchlist from localStorage
  useEffect(() => {
    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setWatchlist(savedWatchlist);
    setIsInWatchlist(savedWatchlist.includes(symbol));
  }, [symbol]);
  
  // Toggle watchlist item
  const toggleWatchlistItem = () => {
    const currentWatchlist = [...watchlist];
    
    if (isInWatchlist) {
      // Remove from watchlist
      const updatedWatchlist = currentWatchlist.filter(item => item !== symbol);
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      setWatchlist(updatedWatchlist);
    } else {
      // Add to watchlist
      currentWatchlist.push(symbol || '');
      localStorage.setItem('watchlist', JSON.stringify(currentWatchlist));
      setWatchlist(currentWatchlist);
    }
    
    setIsInWatchlist(!isInWatchlist);
  };
  
  // Toggle between top gainers and watchlist
  const toggleWatchlistView = () => {
    setShowWatchlist(!showWatchlist);
  };
  
  // Dummy exchange rate (in a real app, this would come from an API)
  const exchangeRate = project ? project.price : 1;
  
  // Handle swap percentage click
  const handlePercentageClick = (percentage: string) => {
    setActivePercentage(percentage);
    
    if (swapDirection) {
      // USDC to Coin
      const usdcValue = 1000; // Example balance
      const amount = (parseInt(percentage) / 100) * usdcValue;
      setFromAmount(amount.toString());
      setToAmount((amount / exchangeRate).toFixed(6));
    } else {
      // Coin to USDC
      const coinValue = 10; // Example balance
      const amount = (parseInt(percentage) / 100) * coinValue;
      setFromAmount(amount.toString());
      setToAmount((amount * exchangeRate).toFixed(6));
    }
  };
  
  // Handle swap direction change
  const toggleSwapDirection = () => {
    setSwapDirection(!swapDirection);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setActivePercentage('');
  };
  
  // Handle from amount change
  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);
    
    if (value === '') {
      setToAmount('');
      return;
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    if (swapDirection) {
      // USDC to Coin
      setToAmount((numValue / exchangeRate).toFixed(6));
    } else {
      // Coin to USDC
      setToAmount((numValue * exchangeRate).toFixed(6));
    }
    
    setActivePercentage('');
  };
  
  // Handle to amount change
  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToAmount(value);
    
    if (value === '') {
      setFromAmount('');
      return;
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    if (swapDirection) {
      // USDC to Coin
      setFromAmount((numValue * exchangeRate).toFixed(6));
    } else {
      // Coin to USDC
      setFromAmount((numValue / exchangeRate).toFixed(6));
    }
    
    setActivePercentage('');
  };

  useEffect(() => {
    // Dynamically load TradingView widget script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      // Once loaded, create the widget
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol?.toUpperCase() || 'BTCUSDT'}`,
          interval: '60',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_widget'
        });
      }
    };
    document.body.appendChild(script);
    
    return () => {
      // Cleanup script on component unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol]);

  // Add this useEffect to handle tab switching
  useEffect(() => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    const handleTabClick = (event: Event) => {
      const button = event.currentTarget as HTMLElement;
      const tabId = button.getAttribute('data-tab');
      
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      document.getElementById(tabId!)?.classList.add('active');
    };
    
    tabButtons.forEach(button => {
      button.addEventListener('click', handleTabClick);
    });
    
    return () => {
      tabButtons.forEach(button => {
        button.removeEventListener('click', handleTabClick);
      });
    };
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  // Show error state if project data wasn't passed
  if (!project) {
    return (
      <div className="coin-detail-container">
        <div className="error-message">
          <h2>Error loading coin data</h2>
          <button onClick={handleBackClick} className="back-button">Back to List</button>
        </div>
      </div>
    );
  }

  // Define getWatchlistCoins INSIDE the component
  const getWatchlistCoins = () => {
    // Add debugging to verify watchlist contents
    console.log("Current watchlist:", watchlist);
    console.log("Available tokens:", topGainers.map(t => t.symbol));
    
    // Convert all symbols to uppercase for case-insensitive matching
    const watchlistUpper = watchlist.map(item => item.toUpperCase());
    const filteredCoins = topGainers.filter(coin => 
      watchlistUpper.includes(coin.symbol.toUpperCase())
    );
    
    console.log("Filtered watchlist coins:", filteredCoins);
    return filteredCoins;
  };

  return (
    <div className="coin-detail-container">
      {/* Update the header section with new positioning */}
      <header className="header">
        <img src={takeoffLogo} alt="Takeoff Logo" className="header-logo" />
        <div className="header-center">
          {/* Empty center section */}
        </div>
        <div className="header-right">
          <button className="wallet-button">Select Wallet</button>
        </div>
      </header>

      {/* Coin detail information section with back button on the left */}
      <div className="coin-detail-header">
        <button onClick={handleBackClick} className="back-button">
          ← Back
        </button>
        <div className="coin-basic-info">
          <img src={logoSrc} alt={`${project.symbol} logo`} className="coin-logo" />
          <div className="coin-name-price">
            <div className="coin-title-container">
              <h1>{project.symbol}</h1>
              <button 
                className={`watchlist-star ${isInWatchlist ? 'active' : ''}`}
                onClick={toggleWatchlistItem}
                aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              >
                ★
              </button>
            </div>
            <div className="price-section">
              <span className="current-price">${project.price.toFixed(2)}</span>
              <span className={`price-change ${project.dayChange >= 0 ? 'positive' : 'negative'}`}>
                {project.dayChange >= 0 ? '+' : ''}{project.dayChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tokens section with toggle at top right */}
      <div className="tokens-section">
        {/* Toggle positioned at top right */}
        <div className="toggle-switch-container">
          <div className="emoji-toggle">
            <div 
              className={`emoji-option ${!showWatchlist ? 'active' : ''}`}
              onClick={() => setShowWatchlist(false)}
            >
              🔥
            </div>
            <div 
              className={`emoji-option ${showWatchlist ? 'active' : ''} ${watchlist.length === 0 ? 'disabled' : ''}`}
              onClick={() => {
                if (watchlist.length > 0) {
                  console.log("Toggling to watchlist view");
                  setShowWatchlist(true);
                } else {
                  console.log("Watchlist is empty, not toggling");
                }
              }}
            >
              ★
            </div>
          </div>
        </div>
        
        {/* Tokens scroll container */}
        <div className="tokens-scroll-container no-margin">
          <div className="tokens-scroll">
            <div className="tokens-scroll-inner">
              {showWatchlist ? (
                // Show watchlisted coins with even spacing
                getWatchlistCoins().map((token, index) => (
                  <div key={index} className="token-card">
                    <div className="token-name">{token.symbol}</div>
                    <div className="token-price">${token.price}</div>
                    <div className={`token-change ${token.change >= 0 ? 'positive' : 'negative'}`}>
                      +{token.change}%
                    </div>
                  </div>
                ))
              ) : (
                // Show top gainers with even spacing
                topGainers.map((token, index) => (
                  <div key={index} className="token-card">
                    <div className="token-name">{token.symbol}</div>
                    <div className="token-price">${token.price}</div>
                    <div className={`token-change positive`}>
                      +{token.change}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="main-content-grid">
        {/* Left column - Chart and trade history */}
        <div className="left-column">
          <div className="chart-container">
            <div id="tradingview_widget" className="tradingview-widget"></div>
          </div>
          
          {/* Move trade history inside the left column */}
          <div className="trade-history-container">
            <div className="tabs-container">
              <div className="tabs-navigation">
                <button className="tab-button active" data-tab="transactions">Transactions</button>
                <button className="tab-button" data-tab="holders">Holders</button>
                <button className="tab-button" data-tab="positions">My positions</button>
                <button className="tab-button" data-tab="orders">my orders</button>
              </div>
              
              {/* Tab content */}
              <div className="tab-content active" id="transactions">
                <div className="trade-history">
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>Time</th>
                        <th>Trader</th>
                        <th>TX</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="buy">
                        <td>Buy</td>
                        <td>$166.76</td>
                        <td>38.50M</td>
                        <td>4d</td>
                        <td>devsTx</td>
                        <td><a href="#">2bKe</a></td>
                      </tr>
                      <tr className="sell">
                        <td>Sell</td>
                        <td>$180.15</td>
                        <td>22.98M</td>
                        <td>4d</td>
                        <td>devsTx</td>
                        <td><a href="#">3Nbz</a></td>
                      </tr>
                      <tr className="buy">
                        <td>Buy</td>
                        <td>$177.39</td>
                        <td>44.58M</td>
                        <td>4d</td>
                        <td>devsTx</td>
                        <td><a href="#">5vu2</a></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="tab-content" id="holders">
                <div className="holders-table-container">
                  <table className="holders-table">
                    <thead>
                      <tr>
                        <th>WALLET</th>
                        <th>% OWNED</th>
                        <th>AMOUNT</th>
                        <th>VALUE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="wallet-address">
                          <span>4wjarn...khj9</span>
                        </td>
                        <td>99.61%</td>
                        <td>996M</td>
                        <td>$4K</td>
                      </tr>
                      <tr>
                        <td className="wallet-address">
                          <span>GTBgN9...nDdw</span>
                        </td>
                        <td>0.28%</td>
                        <td>2.8M</td>
                        <td>$14.33</td>
                      </tr>
                      <tr>
                        <td className="wallet-address">
                          <span>1hy254...71Tu</span>
                        </td>
                        <td>0.24%</td>
                        <td>2.4M</td>
                        <td>$12.29</td>
                      </tr>
                      <tr>
                        <td className="wallet-address">
                          <span>6Nvqfv...oPc6</span>
                        </td>
                        <td>0.11%</td>
                        <td>1.1M</td>
                        <td>$5.41</td>
                      </tr>
                      <tr>
                        <td className="wallet-address">
                          <span>GQLtUR...Rr5N</span>
                        </td>
                        <td>0.00%</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td className="wallet-address">
                          <span>A84Cav...oaiz</span>
                        </td>
                        <td>0.00%</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td className="wallet-address">
                          <span>FhCtJ...szZS</span>
                        </td>
                        <td>0.00%</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td className="wallet-address">
                          <span>BuHi7y...jNbu</span>
                        </td>
                        <td>0.00%</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td className="wallet-address">
                          <span>6dYnNr...8E2b</span>
                        </td>
                        <td>0.00%</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td className="wallet-address">
                          <span>7eJUx5...qvjU</span>
                        </td>
                        <td>0.00%</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td className="wallet-address">
                          <span>9YTG76...1qcS</span>
                        </td>
                        <td>0.00%</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td className="wallet-address">
                          <span>Aj2×4C...yxfT</span>
                        </td>
                        <td>0.00%</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td className="wallet-address">
                          <span>HH7Qj2...kb3k</span>
                        </td>
                        <td>0.00%</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="tab-content" id="positions">
                {/* My positions content will be added later */}
                <div className="placeholder-content">
                  My positions content coming soon...
                </div>
              </div>
              
              <div className="tab-content" id="orders">
                {/* Orders content will be added later */}
                <div className="placeholder-content">
                  Orders content coming soon...
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Info panel and swap */}
        <div className="right-column">
          {/* Token info panel */}
          <div className="token-info-panel">
            <h2>{project.symbol}</h2>
            <div className="token-address-container">
              <div className="token-address">
                {/* Sample address - in real app would come from blockchain data */}
                <span>BeMfXHetv3jgpf1JuhWIjATT7CvUv2Cvnh1teEtv2gWW</span>
              </div>
              <button 
                className="copy-address-button" 
                onClick={() => {
                  navigator.clipboard.writeText("BeMfXHetv3jgpf1JuhWIjATT7CvUv2Cvnh1teEtv2gWW");
                  // Show copy feedback
                  const copyButton = document.querySelector('.copy-address-button');
                  if (copyButton) {
                    copyButton.classList.add('copied');
                    setTimeout(() => {
                      copyButton.classList.remove('copied');
                    }, 1500);
                  }
                }}
                title="Copy to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span className="copy-feedback">Copied!</span>
              </button>
            </div>
            
            <div className="token-info-grid">
              <div className="info-item">
                <div className="info-label">Price</div>
                <div className="info-value">${project.price.toFixed(2)}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Floor Price</div>
                <div className="info-value">${project.floor.toFixed(4)}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Marketcap</div>
                <div className="info-value">${(project.marketCap / 1000).toFixed(2)}B</div>
              </div>
              <div className="info-item">
                <div className="info-label">TVL</div>
                <div className="info-value">${(project.volume * 10).toFixed(2)}B</div>
              </div>
              <div className="info-item">
                <div className="info-label">Buy Fee</div>
                <div className="info-value">1%</div>
              </div>
              <div className="info-item">
                <div className="info-label">Sell Fee</div>
                <div className="info-value">1%</div>
              </div>
              <div className="info-item">
                <div className="info-label">Floor Ratio</div>
                <div className="info-value">{(project.floor / project.price).toFixed(4)}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Supply</div>
                <div className="info-value">{(project.marketCap / project.price).toFixed(2)}M</div>
              </div>
            </div>
          </div>
          
          {/* Swap panel - move from below */}
          <div className="swap-container">
            <div className="swap-header">
              <h2 className="swap-title">Swap</h2>
              <div className="percentage-options">
                <button 
                  className={`percentage-button ${activePercentage === '50' ? 'active' : ''}`}
                  onClick={() => handlePercentageClick('50')}
                >
                  50%
                </button>
                <button 
                  className={`percentage-button ${activePercentage === '100' ? 'active' : ''}`}
                  onClick={() => handlePercentageClick('100')}
                >
                  100%
                </button>
              </div>
            </div>
            
            <div className="currency-input-container">
              <div className="currency-selector">
                <img 
                  src={swapDirection ? '/usdc-logo.png' : logoSrc} 
                  alt={swapDirection ? 'USDC logo' : `${project.symbol} logo`} 
                  className="currency-logo"
                />
                <span className="currency-symbol">{swapDirection ? 'USDC' : project.symbol}</span>
              </div>
              <input
                type="text"
                className="currency-input"
                value={fromAmount}
                onChange={handleFromAmountChange}
                placeholder="0"
              />
            </div>
            
            <div className="swap-direction-button" onClick={toggleSwapDirection}>
              ↑↓
            </div>
            
            <div className="currency-input-container">
              <div className="currency-selector">
                <img 
                  src={swapDirection ? logoSrc : '/usdc-logo.png'} 
                  alt={swapDirection ? `${project.symbol} logo` : 'USDC logo'} 
                  className="currency-logo"
                />
                <span className="currency-symbol">{swapDirection ? project.symbol : 'USDC'}</span>
              </div>
              <input
                type="text"
                className="currency-input"
                value={toAmount}
                onChange={handleToAmountChange}
                placeholder="0"
              />
            </div>
            
            <div className="slider-container">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={activePercentage || "0"} 
                className="swap-slider"
                onChange={(e) => {
                  const value = e.target.value;
                  handlePercentageClick(value);
                }}
              />
              <div className="slider-labels">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
            
            <button className="swap-button swap-button-green">
              SWAP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reuse the formatAge function
const formatAge = (timestamp: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  
  const seconds = Math.floor(diffMs / 1000) % 60;
  const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
  const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
};

export default CoinDetailPage; 