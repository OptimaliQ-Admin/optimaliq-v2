import { Article } from "./fetchNews";

export interface Theme {
  title: string;
  summary: string;
  supportingUrls: string[];
}

export async function ClusterTopics(articles: Article[]): Promise<Theme[]> {
  // TODO: implement with cheap LLM; return empty for now
  return [];
}


