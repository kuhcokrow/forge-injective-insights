import { FastifyReply, FastifyRequest } from 'fastify'
import * as marketService from '../services/market.service' 
import { addSnapshot, calculateVolatility } from '../utils/volatility'

export const getAllMarkets = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
    const markets = await marketService.getAllMarkets()
    return res.status(200).send(markets)
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
  req: FastifyRequest<{ Params: { marketId: string } }>,
  res: FastifyReply
) => {
  try {
    const { marketId } = req.params
    const orderbook = await marketService.fetchOrderbook(marketId)
    return res.status(200).send(orderbook)
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

    addSnapshot(marketId, {
      midPrice: (summary.topBid + summary.topAsk) / 2,
      spread: summary.spread ?? 0,
      totalDepth: liquidity.totalDepth
    });

    const volatility = calculateVolatility(marketId);

    return res.send({
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
    });
  } catch (error) {
    return res.status(500).send({
      error: "Failed to fetch market analytics"
    });
  }
};

export const getRank = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  try {
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

    return res.send({
      count: results.length,
      ranking: results
    });
  } catch (error) {
    return res.status(500).send({
      error: "Failed to rank markets"
    });
  }
};
