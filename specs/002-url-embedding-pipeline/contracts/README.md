# Contracts: URL Embedding Pipeline

**Feature**: 002-url-embedding-pipeline

## Overview

This feature is a CLI pipeline with no external API endpoints. The "contracts" are the external service integrations.

---

## External Service Contracts

### 1. Cohere Embed API

**Endpoint**: `https://api.cohere.ai/v1/embed`

**Request**:
```json
{
  "texts": ["chunk1", "chunk2", ...],
  "model": "embed-english-v3.0",
  "input_type": "search_document"
}
```

**Response**:
```json
{
  "embeddings": [[0.123, 0.456, ...], ...],
  "meta": {"api_version": {"version": "1"}}
}
```

**Constraints**:
- Max 96 texts per request
- Max 512 tokens per text (truncated if longer)
- Rate limit: 100 requests/minute (free tier)

---

### 2. Qdrant Cloud API

**Collection Creation**:
```json
PUT /collections/textbook
{
  "vectors": {
    "size": 1024,
    "distance": "Cosine"
  }
}
```

**Upsert Points**:
```json
PUT /collections/textbook/points
{
  "points": [
    {
      "id": "abc123...",
      "vector": [0.1, 0.2, ...],
      "payload": {
        "text": "chunk content",
        "url": "https://...",
        "module": "module-1",
        "chapter": "chapter-1",
        "section": "Introduction",
        "chunk_index": 0,
        "ingested_at": "2025-12-26T10:00:00Z"
      }
    }
  ]
}
```

**Constraints**:
- Free tier: 1GB storage
- Max batch size: 100 points per request (recommended)

---

## Internal Function Contracts

Since all logic is in `main.py`, these are the key function signatures:

```python
def discover_urls(base_url: str) -> List[str]:
    """Crawl sitemap/links to find all page URLs."""

def fetch_page(url: str) -> Optional[Page]:
    """Fetch and parse a single page."""

def extract_content(html: str) -> str:
    """Extract clean text from HTML."""

def chunk_content(page: Page) -> List[Chunk]:
    """Split page content into chunks with metadata."""

def generate_embeddings(chunks: List[Chunk]) -> List[List[float]]:
    """Generate embeddings via Cohere API (batched)."""

def store_vectors(chunks: List[Chunk], embeddings: List[List[float]]) -> int:
    """Upsert vectors to Qdrant, return count stored."""

def main() -> None:
    """Orchestrate full pipeline."""
```
