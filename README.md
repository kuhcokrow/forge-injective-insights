# FII - Forge Injective Insights

**Real-Time Market Insights & Analytics API for Injective Protocol**

A comprehensive REST API that aggregates, analyzes, and provides actionable market insights for Injective Protocol's DEX markets. FII delivers real-time market data, liquidity metrics, volatility analysis, and market summaries to empower developers with deep trading insights and analysis tools.

---

## 🎯 Overview

FII is a developer-focused API service that transforms raw Injective market data into clean, meaningful insights. It aggregates order book data, computes liquidity metrics, analyzes market volatility, and ranks markets by liquidity score—all through intuitive REST endpoints.

### 📚 Interactive API Documentation

Explore and test all endpoints with **Swagger/OpenAPI UI**:
```
http://localhost:3000/docs
```

The interactive documentation includes:
- ✅ Full endpoint specifications
- 🧪 Try-it-out functionality to test endpoints
- 📋 Request/response examples
- 🔍 Schema definitions for all data types

**Key Features:**
- 📊 Real-time market data aggregation
- 💧 Advanced liquidity analytics
- 📈 Market volatility computation
- 🏆 Market rankings by liquidity score
- 📋 Order book depth analysis
- 🎯 Market health indicators

---

## 🏗️ Project Structure

```
src/
├── app.ts                 # Express application setup
├── server.ts              # Server initialization
├── config/
│   ├── swagger.ts         # Swagger/OpenAPI configuration
│   └── schemas.ts         # OpenAPI endpoint schemas
├── controllers/
│   └── market.controller.ts    # Market request handlers
├── routes/
│   └── market.route.ts         # API route definitions
├── services/
│   ├── injective.service.ts    # Injective blockchain integration
│   ├── market.service.ts       # Market data aggregation logic
├── utils/
│   ├── formater.ts            # Data formatting utilities
│   ├── liquidity.ts           # Liquidity calculation functions
│   └── volatility.ts          # Volatility analysis functions
```

---

## 📡 API Endpoints

### 1. **List Markets**
Retrieve paginated list of active markets with basic information.

**Endpoint:**
```
GET /api/markets?page=1&limit=10
```

**Query Parameters:**
- `page` (number, optional): Page number. Default: 1
- `limit` (number, optional): Results per page. Default: 10
- `status` (string, optional): Filter by market status. 
- `ticker` (string, optional): Filter by ticker symbol. Example: `INJ`

**Response Example:**
```json
{
    "data": [
        {
            "marketId": "0x9b13c89f8f10386b61dd3a58aae56d5c7995133534ed65ac9835bb8d54890961",
            "ticker": "SNOWY/INJ",
            "quoteDenom": "inj",
            "baseDenom": "factory/inj1ml33x7lkxk6x2x95d3alw4h84evlcdz2gnehmk/SNOWY",
            "status": "active"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 65,
        "totalPages": 7
    }
}
```

---

### 2. **Get Market Details**
Retrieve detailed information about a specific market including token details and fee rates.

**Endpoint:**
```
GET /api/markets/:marketId
```

**Path Parameters:**
- `marketId` (string, required): The market ID from Injective

**Response Example:**
```json
{
    "marketId": "0x0511ddc4e6586f3bfe1acb2dd905f8b8a82c97e1edaef654b12ca7e6031ca0fa",
    "marketStatus": "active",
    "ticker": "ATOM/USDT",
    "baseDenom": "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
    "quoteDenom": "peggy0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "quoteToken": {
        "name": "Tether",
        "symbol": "USDT",
        "decimals": 6,
        "logo": "https://imagedelivery.net/..."
    },
    "baseToken": {
        "name": "Cosmos",
        "symbol": "ATOM",
        "decimals": 6,
        "logo": "https://imagedelivery.net/..."
    },
    "makerFeeRate": "0",
    "takerFeeRate": "0.0005",
    "minNotional": 1000000
}
```

---

### 3. **Get Order Book**
Retrieve current order book data with bids and asks.

**Endpoint:**
```
GET /api/markets/:marketId/orderbook?page=1&limit=10
```

**Query Parameters:**
- `page` (number, optional): Page number. Default: 1
- `limit` (number, optional): Results per page. Default: 10

**Response Example:**
```json
{
    "buys": [
        {
            "price": "2.208",
            "quantity": "4130000",
            "timestamp": 1771140726510
        }
    ],
    "sells": [
        {
            "price": "2.209",
            "quantity": "2760000",
            "timestamp": 1771140831736
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "totalBuys": 170,
        "totalSells": 2207
    }
}
```

---

### 4. **Get Market Summary**
Quick market snapshot with current bid, ask, and spread.

**Endpoint:**
```
GET /api/markets/:marketId/summary
```

**Response Example:**
```json
{
    "marketId": "0x0511ddc4e6586f3bfe1acb2dd905f8b8a82c97e1edaef654b12ca7e6031ca0fa",
    "ticker": "ATOM/USDT",
    "marketStatus": "active",
    "topBid": 2.208,
    "topAsk": 2.209,
    "spread": 0.001
}
```

---

### 5. **Get Liquidity Metrics**
Comprehensive liquidity analysis including depth, imbalance, and liquidity score.

**Endpoint:**
```
GET /api/markets/:marketId/liquidity
```

**Response Example:**
```json
{
    "marketId": "0x0511ddc4e6586f3bfe1acb2dd905f8b8a82c97e1edaef654b12ca7e6031ca0fa",
    "totalBidDepth": 21523656880,
    "totalAskDepth": 16826243700,
    "totalDepth": 38349900580,
    "spread": 0.001,
    "midPrice": 2.2085,
    "imbalance": 0.122488,
    "liquidityScore": 23.753
}
```

**Response Fields:**
- `totalBidDepth`: Total depth of buy orders
- `totalAskDepth`: Total depth of sell orders
- `totalDepth`: Combined bid and ask depth
- `imbalance`: Market imbalance ratio (buy pressure)
- `liquidityScore`: Composite liquidity metric (0-100)

---

### 6. **Get Market Analysis**
Complete market analysis combining summary, liquidity, and volatility metrics.

**Endpoint:**
```
GET /api/markets/:marketId/analytics
```

**Response Example:**
```json
{
    "marketId": "0x0511ddc4e6586f3bfe1acb2dd905f8b8a82c97e1edaef654b12ca7e6031ca0fa",
    "spread": 0.001,
    "summary": {
        "ticker": "ATOM/USDT",
        "marketStatus": "active",
        "topBid": 2.208,
        "topAsk": 2.209
    },
    "liquidity": {
        "totalBidDepth": 21526212240,
        "totalAskDepth": 8885160730,
        "totalDepth": 30411372970,
        "midPrice": 2.2085,
        "imbalance": 0.415669,
        "liquidityScore": 22.0552
    },
    "volatility": {
        "priceVolatility": 0,
        "spreadVolatility": 0,
        "depthVolatility": 0.11549696933069659,
        "volatilityScore": 0.02309939386613932,
        "level": "high"
    }
}
```

---

### 7. **Get Top Markets by Liquidity**
Ranked list of markets sorted by liquidity score.

**Endpoint:**
```
GET /api/markets/top-liquidity?page=1&limit=10
```

**Query Parameters:**
- `page` (number, optional): Page number. Default: 1
- `limit` (number, optional): Results per page. Default: 10

**Response Example:**
```json
{
    "data": [
        {
            "marketId": "0xbfe7d87d8cc189488fc800bfddadea0d8608e153aa588d7705ba9ab4da205de4",
            "liquidityScore": 64.8008,
            "totalDepth": 1e+39
        },
        {
            "marketId": "0x1f5d69fc3d063e2a130c29943a0c83c3e79c2ba897fe876fcd82c51ab2ea61de",
            "liquidityScore": 58.7491,
            "totalDepth": 10000000000000000000
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 136,
        "totalPages": 14
    }
}
```

---

## 🔌 Injective Data Sources

FII integrates with the following Injective Protocol data sources:

- **Markets Endpoint**: Fetches active market listings and metadata
- **Market Details**: Retrieves token information, fee rates, and trading parameters
- **Order Book Data**: Accesses real-time bid/ask data and depth information
- **Price Feed**: Tracks current market prices and spreads

All data is directly sourced from Injective's on-chain DEX infrastructure.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kuhcokrow/fii-ninja-api.git
   cd fii-ninja-api
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```
   
   This includes Swagger/OpenAPI dependencies for interactive API documentation.

3. **Build the project**
   ```bash
   pnpm build
   ```

4. **Run the API locally**
   ```bash
   pnpm start
   ```

   The API will be available at `http://localhost:3000`
   
   📚 **API Documentation**: http://localhost:3000/docs

### Development Mode
   ```bash
   pnpm dev
   ```

   Runs the API with hot-reload enabled for active development.

---

## 📊 Use Cases

### For Traders
- Monitor market health and liquidity before placing orders
- Track volatility and imbalance across markets
- Identify opportunities in less-liquid markets

### For Developers
- Build trading algorithms with reliable market data
- Aggregate data from multiple markets
- Create risk management tools using liquidity metrics

### For Analytics
- Analyze market trends over time
- Compare markets by liquidity and volatility
- Generate market health reports

---

## 🛠️ Technology Stack

- **Runtime**: Node.js / TypeScript
- **Framework**: Fastify
- **API Documentation**: Swagger/OpenAPI 3.0 with Fastify UI
- **Data Source**: Injective Protocol
- **Language**: TypeScript
- **Package Manager**: pnpm

---

## 📈 API Design Philosophy

FII follows these design principles:

1. **Simplicity**: Intuitive endpoints that mirror developer mental models
2. **Composability**: Independent endpoints that can be combined for complex queries
3. **Performance**: Efficient data structures and minimal payload sizes
4. **Developer Experience**: Consistent response formats and clear error messages
5. **Extensibility**: Clean architecture that allows easy addition of new analytics

---

## 🏆 Hackathon Submission

**Hackathon**: Ninja Forge API (28/1/2026 - 15/2/2026)  
**Project Name**: Forge Injective Insights  
**Category**: Data Aggregation & Computation APIs  
**Focus**: Market analytics, liquidity metrics, volatility analysis  

This project demonstrates the power of thoughtful API design for the Injective ecosystem, providing developers with meaningful, processed market data rather than raw information.

---

**Built with ❤️ for the Injective Community**
