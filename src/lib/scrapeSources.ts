// scrapeSources.ts
import { load } from "cheerio";

export const scrapeHeadlinesFromUrls = async (urls: string[]) => {
  const allHeadlines: string[] = [];

  for (const url of urls) {
    try {
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
