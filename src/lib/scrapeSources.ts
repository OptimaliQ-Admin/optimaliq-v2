// scrapeSources.ts
import { load } from "cheerio";

const MAX_URLS_PER_RUN = 2;

export const scrapeHeadlinesFromUrls = async (urls: string[]) => {
  const allHeadlines: string[] = [];

  // 🔁 Shuffle + pick a few URLs
  const shuffled = urls.sort(() => 0.5 - Math.random());
  const selectedUrls = shuffled.slice(0, MAX_URLS_PER_RUN);

  for (const url of selectedUrls) {
    try {
      console.log(`🔍 Scraping: ${url}`);
      const html = await fetch(url).then((res) => res.text());
      const $ = load(html);
      $("h1, h2, h3, p").each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 40 && text.length < 300) {
          allHeadlines.push(`- ${text}`);
        }
      });
    } catch (err) {
      console.warn("⚠️ Failed to scrape:", url);
    }
  }

  return allHeadlines;
};
