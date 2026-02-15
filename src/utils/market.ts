export const calculateSpread = (topBid: number, topAsk: number) => {
  if (!topBid || !topAsk) return null
  return round(topAsk - topBid)
}

export const round = (num: number, decimals: number = 6) => {
  return Number(num.toFixed(decimals))
}