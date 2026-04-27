export default async function handler(req, res) {
  const origin = req.headers["origin"] || "";
  const referer = req.headers["referer"] || origin;
  const allowedOrigins = ["https://patra.fr", "https://www.patra.fr", "https://patra-web-phi.vercel.app"];
  const matchedOrigin = allowedOrigins.find(o => referer.includes(o.replace("https://", "")));
  const isVercelPreview = referer.includes("patra-web") && referer.includes(".vercel.app");
  if (matchedOrigin) res.setHeader("Access-Control-Allow-Origin", matchedOrigin);
  if (process.env.NODE_ENV === "production" && !matchedOrigin && !isVercelPreview) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { q, account } = req.query;
  if (!q || q.trim().length < 1) return res.status(400).json({ error: "q required" });

  // Suffixes de bourses UE/EEE — titres éligibles au PEA
  const PEA_SUFFIXES = [
    ".PA",".AS",".BR",".LS",  // Euronext (Paris, Amsterdam, Bruxelles, Lisbonne)
    ".DE",".F",".MU",".BE",   // Allemagne (Xetra, Frankfurt, Munich, Berlin)
    ".MI",".TI",              // Italie (Milan)
    ".MC",                    // Espagne (Madrid)
    ".VI",                    // Autriche (Vienne)
    ".HE",                    // Finlande (Helsinki)
    ".CO",                    // Danemark (Copenhague)
    ".ST",                    // Suède (Stockholm)
    ".OL",                    // Norvège (Oslo — EEE)
    ".IC",                    // Islande (EEE)
    ".IR",                    // Irlande (Euronext Dublin)
    ".WA",                    // Pologne (Varsovie)
    ".AT",                    // Grèce (Athènes)
    ".PR",                    // République tchèque (Prague)
  ];

  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=16&newsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    const data = await response.json();
    let quotes = (data.quotes || []).filter(q => q.isYahooFinance && ["EQUITY","ETF","MUTUALFUND"].includes(q.quoteType));
    if (account === "pea") {
      quotes = quotes.filter(q => PEA_SUFFIXES.some(s => q.symbol.endsWith(s)));
    }
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=30");
    return res.status(200).json({ quotes });
  } catch (err) {
    return res.status(500).json({ error: "fetch failed" });
  }
}
