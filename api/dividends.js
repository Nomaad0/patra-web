export default async function handler(req, res) {
  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: "ticker required" });

  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(ticker)}?modules=summaryDetail`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    const data = await response.json();
    const summaryDetail = data?.quoteSummary?.result?.[0]?.summaryDetail;
    const dividendRate = summaryDetail?.dividendRate?.raw ?? null;
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=300");
    return res.status(200).json({ dividendRate });
  } catch (err) {
    return res.status(500).json({ error: "fetch failed" });
  }
}
