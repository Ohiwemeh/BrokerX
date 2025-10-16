# Trading Platform Feature

## Overview
A fully functional trading platform with TradingView-like interface that allows users to trade cryptocurrencies with real-time charts and market data.

## Features

### 1. **Interactive Charts**
- **Candlestick Chart**: Professional candlestick charts with OHLC data
- **Line Chart**: Simple line chart for price trends
- **Area Chart**: Filled area chart for better visualization
- Powered by `lightweight-charts` library for high performance

### 2. **Market Data**
- Real-time cryptocurrency prices from CoinGecko API
- 24-hour price changes and volume
- Market statistics (24h high/low, market cap, trading volume)
- Auto-refresh every 30 seconds

### 3. **Watchlist Sidebar**
- Search functionality for quick asset lookup
- List of all available cryptocurrencies
- Click any crypto to switch trading pairs
- Real-time price updates

### 4. **Trading Panel**
- Buy/Sell order placement
- Price and amount input fields
- Quick percentage buttons (25%, 50%, 75%, 100%)
- Available balance display
- Order confirmation modal
- Recent orders history

### 5. **Timeframe Selection**
- Multiple timeframes: 1m, 5m, 15m, 1H, 4H, 1D, 1W, 1M
- Chart type switcher (Candlestick, Line, Area)
- Fullscreen mode support

### 6. **Supported Cryptocurrencies**
- Bitcoin (BTC)
- Ethereum (ETH)
- Tether (USDT)
- Binance Coin (BNB)
- Solana (SOL)
- Ripple (XRP)

## Usage

### Accessing the Trading Platform
1. From the **Dashboard**, click on any cryptocurrency icon in the right sidebar
2. You'll be redirected to `/trade/{crypto-id}` (e.g., `/trade/bitcoin`)
3. The platform loads with the selected cryptocurrency

### Navigation
- **Left Sidebar**: Watchlist with search and all available cryptos
- **Center**: Main chart area with timeframe and chart type controls
- **Right Sidebar**: Order placement panel with buy/sell options
- **Top Bar**: Current asset info, price, and 24h change

### Placing Orders
1. Select **Buy** or **Sell** tab in the right panel
2. Enter the **Price** (defaults to current market price)
3. Enter the **Amount** you want to trade
4. Use quick percentage buttons to calculate amount based on balance
5. Review the **Total** cost
6. Click **Buy/Sell** button
7. Confirm the order in the modal

### Chart Interaction
- **Zoom**: Scroll to zoom in/out on the chart
- **Pan**: Click and drag to move the chart
- **Crosshair**: Hover to see price and time details
- **Timeframe**: Click timeframe buttons to change chart period
- **Chart Type**: Click chart type icons to switch visualization

## Technical Details

### Dependencies
- `lightweight-charts`: Professional financial charts
- `recharts`: Additional charting components
- `react-router`: Navigation and routing
- `react-icons`: Icon library
- `axios`: API requests

### API Integration
- **CoinGecko API**: Real-time cryptocurrency prices
- **Custom Backend**: Order placement and user balance (to be implemented)

### File Structure
```
client/src/
├── pages/
│   ├── TradingPlatform.jsx    # Main trading platform component
│   └── Dashboard.jsx           # Dashboard with clickable crypto icons
├── api/
│   ├── cryptoService.js        # Crypto price fetching utilities
│   └── services.js             # Backend API services
└── router.jsx                  # Route configuration
```

### Route Configuration
```javascript
<Route path="/trade/:symbol" element={<TradingPlatform />} />
```

## Future Enhancements
- [ ] Real order execution with backend integration
- [ ] Order book display
- [ ] Trade history
- [ ] Advanced chart indicators (RSI, MACD, Bollinger Bands)
- [ ] Drawing tools on charts
- [ ] Price alerts
- [ ] Multiple chart layouts
- [ ] WebSocket for real-time price updates
- [ ] Portfolio tracking within trading view
- [ ] Stop-loss and take-profit orders

## Notes
- The chart data is currently generated for demonstration purposes
- Order placement requires backend integration for actual execution
- Balance display is currently static and needs backend integration
- All prices are fetched from CoinGecko API (free tier, no API key required)

## Troubleshooting

### Chart not displaying
- Ensure `lightweight-charts` is installed: `npm install lightweight-charts`
- Check browser console for errors
- Verify API is accessible (CoinGecko)

### Prices not updating
- Check internet connection
- Verify CoinGecko API is not rate-limited
- Check browser console for API errors

### Navigation issues
- Ensure routes are properly configured in `router.jsx`
- Check that crypto IDs match CoinGecko IDs (lowercase)
