import { round } from './formater'

interface OrderLevel {
  price: number
  quantity: number
}

export const liquidityMetric = (
  buys: OrderLevel[], sells: OrderLevel[], depth: number = 10
) => {
  const topBuys = buys.slice(0, depth)
  const topSells = sells.slice(0, depth)

  const totalBidDepth = topBuys.reduce((sum, level) => {
    return sum + (Number(level.price) * Number(level.quantity))
  }, 0)

  const totalAskDepth = topSells.reduce((sum, level) => {
    return sum + (Number(level.price) * Number(level.quantity))
  }, 0)

  const totalDepth = totalBidDepth + totalAskDepth

  const topBid = topBuys[0]?.price || 0
  const topAsk = topSells[0]?.price || 0

  const midPrice = (topBid + topAsk) / 2
  const spread = topAsk - topBid

  const imbalance = (totalBidDepth - totalAskDepth) / (totalDepth || 1)

  const depthScore = Math.log(totalDepth || 1)
  const spreadPenalty = midPrice ? spread / midPrice : 0
  const imbalancePenalty = Math.abs(imbalance)

  const liquidityScore = depthScore - spreadPenalty * 10 - imbalancePenalty * 5

  return {
    totalBidDepth: round(totalBidDepth, 2),
    totalAskDepth: round(totalAskDepth, 2),
    totalDepth: round(totalDepth, 2),
    spread: round(spread, 6),
    midPrice: round(midPrice, 6),
    imbalance: round(imbalance, 6),
    liquidityScore : round(liquidityScore, 4)
  }
}
