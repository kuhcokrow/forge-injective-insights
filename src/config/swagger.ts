export const swaggerOptions = {
  swagger: {
    info: {
      title: 'FII - Forge Injective Insights API',
      description:
        'Real-Time Market Insights & Analytics API for Injective Protocol. Comprehensive REST API that aggregates, analyzes, and provides actionable market insights for Injective Protocol\'s DEX markets.',
      version: '1.0.0',
      contact: {
        name: 'FII Team',
        url: 'https://github.com/kuhcokrow/fii-ninja-api',
      },
      license: {
        name: 'MIT',
        url: 'https://github.com/kuhcokrow/fii-ninja-api/blob/main/LICENSE',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
      {
        url: 'https://api.fii-insights.io',
        description: 'Production Server',
      },
    ],
    tags: [
      {
        name: 'Markets',
        description: 'Market data and analytics endpoints',
      },
    ],
    definitions: {
      Market: {
        type: 'object',
        properties: {
          marketId: {
            type: 'string',
            description: 'Unique market identifier from Injective',
          },
          ticker: {
            type: 'string',
            description: 'Trading pair ticker (e.g., ATOM/USDT)',
          },
          quoteDenom: {
            type: 'string',
            description: 'Quote denomination',
          },
          baseDenom: {
            type: 'string',
            description: 'Base denomination',
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            description: 'Market status',
          },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'number' },
          limit: { type: 'number' },
          total: { type: 'number' },
          totalPages: { type: 'number' },
        },
      },
      LiquidityMetrics: {
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
      VolatilityMetrics: {
        type: 'object',
        properties: {
          priceVolatility: { type: 'number' },
          spreadVolatility: { type: 'number' },
          depthVolatility: { type: 'number' },
          volatilityScore: { type: 'number' },
          level: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
          },
        },
      },
    },
  },
};

export const swaggerUIOptions = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list' as const,
    deepLinking: false,
  },
  uiHooks: {
    onRequest: async (request: any, reply: any) => {},
    preHandler: async (request: any, reply: any) => {},
  },
  staticCSP: true,
  transformStaticAssetUrl: (url: string) => url,
  transformSpec: (spec: any) => spec,
  logLevel: 'info' as const,
} as const;
