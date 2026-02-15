export const calculateSpread = (topBid: number, topAsk: number) => {
  if (!topBid || !topAsk) return null
  return round(topAsk - topBid)
}

export const round = (num: number, decimals: number = 6) => {
  return Number(num.toFixed(decimals))
}

export const formatPagination = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number
) => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    }
  };
};

