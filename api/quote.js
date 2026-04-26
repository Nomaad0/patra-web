export default async function handler(req, res) {
  const origin = req.headers["origin"] || "";
  const referer = req.headers["referer"] || origin;
  const allowedOrigins = ["https://patra.fr", "https://www.patra.fr", "https://patra-web-phi.vercel.app"];
  const matchedOrigin = allowedOrigins.find(o => referer.includes(o.replace("https://", "")));
  if (matchedOrigin) res.setHeader("Access-Control-Allow-Origin", matchedOrigin);
  if (process.env.NODE_ENV === "production" && !matchedOrigin) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { ticker, range, interval, period1, period2 } = req.query;
  if (!ticker) return res.status(400).json({ error: "ticker required" });

  const base = "https://query1.finance.yahoo.com/v8/finance/chart";
  const url = period1 && period2
    ? `${base}/${encodeURIComponent(ticker)}?period1=${encodeURIComponent(period1)}&period2=${encodeURIComponent(period2)}&interval=${encodeURIComponent(interval || "1wk")}`
    : `${base}/${encodeURIComponent(ticker)}?range=${encodeURIComponent(range || "1d")}&interval=${encodeURIComponent(interval || "1d")}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: "fetch failed" });
  }
}
