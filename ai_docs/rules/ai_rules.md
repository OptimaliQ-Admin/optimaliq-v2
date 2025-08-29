# Agentic AI Rules — Multi-Provider & RAG

## Core Principles
- **Model Router:** multi-provider selection by latency/cost/health; retry with backoff.
- **Memory:** Short-term (session), medium (TTL snapshots), long (profiles). Persist summaries aligned to UI.
- **RAG:** Clean → embed → store → search → cite. Always include source URLs in trend cards.
- **Determinism:** Keep deterministic score maps for assessments; LLMs draft narratives only.

## Agent JSON Contracts
Agents must emit **strict JSON** for UI contracts; include a critic step that repairs malformed JSON.

```typescript
interface AgentResponse {
  success: boolean;
  data: unknown;
  errors?: string[];
  citations?: Source[];
}

// Critic validation
function validateAgentResponse(response: unknown): AgentResponse {
  const schema = z.object({
    success: z.boolean(),
    data: z.unknown(),
    errors: z.array(z.string()).optional(),
    citations: z.array(SourceSchema).optional()
  });
  
  return schema.parse(response);
}
```

## RAG Pipeline
1. **Clean:** Remove noise, normalize text
2. **Embed:** Generate vector embeddings
3. **Store:** Save to pgvector with metadata
4. **Search:** Semantic similarity search
5. **Cite:** Include source URLs in responses
