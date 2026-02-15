import { FastifyReply, FastifyRequest } from 'fastify'
import * as marketService from '../services/market.service' 
import { addSnapshot, calculateVolatility } from '../utils/volatility'
import { formatPagination } from '../utils/formater'

export const getAllMarkets = async (
  req: FastifyRequest<{ 
    Querystring: { 
      page?: string; limit?: string; ticker?: string; status?: string
    }
  }>, res: FastifyReply
) => {
  try {
    const page = +(req.query.page ?? '1')
    const limit = +(req.query.limit ?? '10')
    const { ticker, status } = req.query
    
    let markets = await marketService.getAllMarkets()
    
    if (ticker) markets = markets.filter(m => m.ticker.toLowerCase().includes(ticker.toLowerCase()))
    if (status) markets = markets.filter(m => m.status === status)
    
    const total = markets.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedMarkets = markets.slice(startIndex, endIndex)

    return res.status(200).send(formatPagination(paginatedMarkets, page, limit, total))
  } catch (err: any) {
    return res.status(500).send({
      error: 'Failed to fetch markets'
    })
  }
}

export const getMarketById = async (
  req: FastifyRequest<{ Params: { marketId: string } }>, 
  res: FastifyReply
) => {
  try {
    const { marketId } = req.params
    const market = await marketService.getMarketById(marketId)
    return res.status(200).send(market)
  }
  catch (err: any) {
    return res.status(404).send({
      error: `Market with ID ${req.params.marketId} not found`
    })
  }
}

export const getOrderbook = async (
  req: FastifyRequest<{ 
    Params: { marketId: string }; 
    Querystring: { page?: string; limit?: string; order?: string; sort?: string } }>,
  res: FastifyReply
) => {
  try {
    const { marketId } = req.params
    const page = +(req.query.page ?? '1')
    const limit = +(req.query.limit ?? '10')
    const orderbook = await marketService.fetchOrderbook(marketId)
    
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedBuys = orderbook.buys.slice(startIndex, endIndex)
    const paginatedSells = orderbook.sells.slice(startIndex, endIndex)
    
    const response = {
      buys: paginatedBuys,
      sells: paginatedSells,
      pagination: {
        page,
        limit,
        totalBuys: orderbook.buys.length,
        totalSells: orderbook.sells.length,
      }
    }
    
    return res.status(200).send(response)
  } catch (err: any) {
    return res.status(500).send({
      error: `Failed to fetch orderbook for market ${req.params.marketId}`
    })
  }
}

export const getSummary = async (
  req: FastifyRequest<{ Params: { marketId: string } }>,
  res: FastifyReply
) => {
  try {
    const { marketId } = req.params
    const summary = await marketService.fetchMarketSummary(marketId)
    return res.status(200).send(summary)
  } catch (err: any) {
    return res.status(500).send({
      error: `Failed to fetch summary for market ${req.params.marketId}`
    })
  }
}

export const getLiquidity = async (
  req: FastifyRequest<{ Params: { marketId: string } }>,
  res: FastifyReply
) => {
  try {
    const { marketId } = req.params
    const liquidity = await marketService.fetchLiquidity(marketId)
    return res.status(200).send(liquidity)
  } catch (err: any) {
    return res.status(500).send({
      error: `Failed to fetch liquidity for market ${req.params.marketId}`
    })
  }
}

export const getAnalytics = async (
  req: FastifyRequest<{ Params: { marketId: string } }>,
  res: FastifyReply
) => {
  try {
    const { marketId } = req.params;

    const summary = await marketService.fetchMarketSummary(marketId);
    const liquidity = await marketService.fetchLiquidity(marketId);

    if (!summary || !liquidity) {
      return res.status(400).send({
        error: "Market data not available",
        marketId,
        summaryExists: !!summary,
        liquidityExists: !!liquidity
      });
    }

    addSnapshot(marketId, {
      midPrice: (summary.topBid + summary.topAsk) / 2,
      spread: summary.spread ?? liquidity.spread,
      totalDepth: liquidity.totalDepth
    });

    const volatility = calculateVolatility(marketId);

    const responseBody = {
      marketId,
      spread : summary.spread ?? liquidity.spread,
      summary: {
        ticker: summary.ticker,
        marketStatus: summary.marketStatus,
        topBid: summary.topBid,
        topAsk: summary.topAsk,
      },
      liquidity: {
        totalBidDepth: liquidity.totalBidDepth,
        totalAskDepth: liquidity.totalAskDepth,
        totalDepth: liquidity.totalDepth,
        midPrice: liquidity.midPrice,
        imbalance: liquidity.imbalance,
        liquidityScore: liquidity.liquidityScore
      },
      volatility
    };


    return res.send(responseBody);
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).send({
      error: "Failed to fetch market analytics",
      details: error.message
    });
  }
};

export const getRank = async (
  req: FastifyRequest<{
    Querystring: { page?: string; limit?: string }
  }>,
  res: FastifyReply
) => {
  try {
    const page = +(req.query.page ?? '1')
    const limit = +(req.query.limit ?? '10')
    
    const markets = await marketService.getAllMarkets();

    const results = [];

    for (const market of markets) {
      const liquidity = await marketService.fetchLiquidity(market.marketId);

      results.push({
        marketId: market.marketId,
        liquidityScore: liquidity.liquidityScore,
        totalDepth: liquidity.totalDepth
      });
    }

    results.sort((a, b) => b.liquidityScore - a.liquidityScore);

    const total = results.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResults = results.slice(startIndex, endIndex)

    return res.send(formatPagination(paginatedResults, page, limit, total));
  } catch (error) {
    return res.status(500).send({
      error: "Failed to rank markets"
    });
  }
};
