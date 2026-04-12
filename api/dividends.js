export default async function handler(req, res) {
  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: "ticker required" });

  // Use v8/chart with events=dividends (same endpoint as quotes — known to work)
  const oneYearAgo = Math.floor((Date.now() - 365 * 24 * 3600 * 1000) / 1000);
  const now = Math.floor(Date.now() / 1000);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?period1=${oneYearAgo}&period2=${now}&interval=1d&events=dividends`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    const data = await response.json();
    const dividends = data?.chart?.result?.[0]?.events?.dividends;
    let dividendRate = null;
    if (dividends) {
      // Sum all dividend payments over the past year
      const total = Object.values(dividends).reduce((sum, d) => sum + (d.amount || 0), 0);
      if (total > 0) dividendRate = Math.round(total * 100) / 100;
    }
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=300");
    return res.status(200).json({ dividendRate });
  } catch (err) {
    return res.status(500).json({ error: "fetch failed" });
  }
}
