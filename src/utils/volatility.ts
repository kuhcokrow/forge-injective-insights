type VolatilitySnapshot = {
  midPrice: number;
  spread: number;
  totalDepth: number;
};

const WINDOW_SIZE = 20;

const volatilityStore: Record<
  string,
  VolatilitySnapshot[]
> = {};

export function addSnapshot(
  marketId: string,
  snapshot: VolatilitySnapshot
) {
  if (!volatilityStore[marketId]) {
    volatilityStore[marketId] = [];
  }

  volatilityStore[marketId].push(snapshot);

  if (volatilityStore[marketId].length > WINDOW_SIZE) {
    volatilityStore[marketId].shift();
  }
}

export function getSnapshots(marketId: string) {
  return volatilityStore[marketId] || [];
}


function std(values: number[]) {
  if (values.length < 2) return 0;

  const mean =
    values.reduce((a, b) => a + b, 0) / values.length;

  const variance =
    values.reduce((sum, val) => sum + (val - mean) ** 2, 0) /
    values.length;

  return Math.sqrt(variance);
}

function getAverage(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function normalizePriceVol(priceStd: number, midPrices: number[]) {
  const meanPrice = getAverage(midPrices);
  if (meanPrice === 0) return 0;
  return priceStd / meanPrice;
}

function normalizeDepthVol(depthStd: number, depths: number[]) {
  const meanDepth = getAverage(depths);
  if (meanDepth === 0) return 0;
  return depthStd / meanDepth;
}

function classifyVolatility(score: number) {
  if (score < 0.005) return "low";
  if (score < 0.02) return "medium";
  return "high";
}

export function calculateVolatility(marketId: string) {
  const snapshots = getSnapshots(marketId);

  const midPrices = snapshots.map(s => s.midPrice);
  const spreads = snapshots.map(s => s.spread);
  const depths = snapshots.map(s => s.totalDepth);

  const priceVolRaw = std(midPrices);
  const priceVol = normalizePriceVol(priceVolRaw, midPrices);
  const spreadVol = std(spreads);
  const depthVolRaw = std(depths);
  const depthVol = normalizeDepthVol(depthVolRaw, depths);

  const volatilityScore =
    priceVol * 0.5 +
    spreadVol * 0.3 +
    depthVol * 0.2;

  return {
    priceVolatility: priceVol,
    spreadVolatility: spreadVol,
    depthVolatility: depthVol,
    volatilityScore,
    level: classifyVolatility(volatilityScore)
  };
}
