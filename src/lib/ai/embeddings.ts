import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function getEmbedding(text: string): Promise<number[] | null> {
  if (!openai) return null;
  const input = text.length > 8000 ? text.slice(0, 8000) : text;
  const res = await openai.embeddings.create({ model: 'text-embedding-3-small', input });
  return res.data?.[0]?.embedding || null;
}


