export const schemas = {
  // List Markets
  listMarketsSchema: {
    description: 'Get paginated list of active markets',
    tags: ['Markets'],
    querystring: {
      type: 'object',
      properties: {
        page: { type: 'number', default: 1, description: 'Page number' },
        limit: { type: 'number', default: 10, description: 'Results per page' },
        status: { type: 'string', description: 'Filter by status (active, inactive)' },
        ticker: { type: 'string', description: 'Filter by ticker symbol' },
      },
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                marketId: { type: 'string' },
                ticker: { type: 'string' },
                quoteDenom: { type: 'string' },
                baseDenom: { type: 'string' },
                status: { type: 'string' },
              },
            },
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'number' },
              limit: { type: 'number' },
              total: { type: 'number' },
              totalPages: { type: 'number' },
            },
          },
        },
      },
    },
  },

  // Get Market Details
  getMarketSchema: {
    description: 'Get detailed information about a specific market',
    tags: ['Markets'],
    params: {
      type: 'object',
      properties: {
        marketId: { type: 'string', description: 'Market ID from Injective' },
      },
      required: ['marketId'],
    },
    response: {
      200: {
        description: 'Market details',
        type: 'object',
        properties: {
          marketId: { type: 'string' },
          marketStatus: { type: 'string' },
          ticker: { type: 'string' },
          baseDenom: { type: 'string' },
          quoteDenom: { type: 'string' },
          quoteToken: { type: 'object' },
          baseToken: { type: 'object' },
          makerFeeRate: { type: 'string' },
          takerFeeRate: { type: 'string' },
          minNotional: { type: 'number' },
        },
      },
    },
  },

  // Get Order Book
  getOrderbookSchema: {
    description: 'Get current order book data with bids and asks',
    tags: ['Markets'],
    params: {
      type: 'object',
      properties: {
        marketId: { type: 'string', description: 'Market ID' },
      },
      required: ['marketId'],
    },
    querystring: {
      type: 'object',
      properties: {
        page: { type: 'number', default: 1 },
        limit: { type: 'number', default: 10 },
      },
    },
    response: {
      200: {
        description: 'Order book data',
        type: 'object',
        properties: {
          buys: { type: 'array' },
          sells: { type: 'array' },
          pagination: { type: 'object' },
        },
      },
    },
  },

  // Get Market Summary
  getSummarySchema: {
    description: 'Get quick market snapshot with current bid, ask, and spread',
    tags: ['Markets'],
    params: {
      type: 'object',
      properties: {
        marketId: { type: 'string' },
      },
      required: ['marketId'],
    },
    response: {
      200: {
        description: 'Market summary',
        type: 'object',
        properties: {
          marketId: { type: 'string' },
          ticker: { type: 'string' },
          marketStatus: { type: 'string' },
          topBid: { type: 'number' },
          topAsk: { type: 'number' },
          spread: { type: 'number' },
        },
      },
    },
  },

  // Get Liquidity Metrics
  getLiquiditySchema: {
    description: 'Get comprehensive liquidity analysis',
    tags: ['Markets'],
    params: {
      type: 'object',
      properties: {
        marketId: { type: 'string' },
      },
      required: ['marketId'],
    },
    response: {
      200: {
        description: 'Liquidity metrics',
        type: 'object',
        properties: {
          marketId: { type: 'string' },
          totalBidDepth: { type: 'number' },
          totalAskDepth: { type: 'number' },
          totalDepth: { type: 'number' },
          spread: { type: 'number' },
          midPrice: { type: 'number' },
          imbalance: { type: 'number' },
          liquidityScore: { type: 'number' },
        },
      },
    },
  },

  // Get Market Analysis
  getAnalyticsSchema: {
    description: 'Get complete market analysis with summary, liquidity, and volatility',
    tags: ['Markets'],
    params: {
      type: 'object',
      properties: {
        marketId: { type: 'string' },
      },
      required: ['marketId'],
    },
    response: {
      200: {
        description: 'Complete market analysis',
        type: 'object',
        properties: {
          marketId: { type: 'string' },
          spread: { type: 'number' },
          summary: {
            type: 'object',
            properties: {
              ticker: { type: 'string' },
              marketStatus: { type: 'string' },
              topBid: { type: 'number' },
              topAsk: { type: 'number' },
              spread: { type: 'number' },
            },
          },
          liquidity: {
            type: 'object',
            properties: {
              totalBidDepth: { type: 'number' },
              totalAskDepth: { type: 'number' },
              totalDepth: { type: 'number' },
              midPrice: { type: 'number' },
              spread: { type: 'number' },
              imbalance: { type: 'number' },
              liquidityScore: { type: 'number' },
            },
          },
          volatility: {
            type: 'object',
            properties: {
              priceVolatility: { type: 'number' },
              spreadVolatility: { type: 'number' },
              depthVolatility: { type: 'number' },
              volatilityScore: { type: 'number' },
              level: { type: 'string' },
            },
          },
        },
      },
    },
  },

  // Get Top Markets by Liquidity
  getRankSchema: {
    description: 'Get ranked list of markets sorted by liquidity score',
    tags: ['Markets'],
    querystring: {
      type: 'object',
      properties: {
        page: { type: 'number', default: 1 },
        limit: { type: 'number', default: 10 },
      },
    },
    response: {
      200: {
        description: 'Top markets by liquidity',
        type: 'object',
        properties: {
          data: { type: 'array' },
          pagination: { type: 'object' },
        },
      },
    },
  },
};
