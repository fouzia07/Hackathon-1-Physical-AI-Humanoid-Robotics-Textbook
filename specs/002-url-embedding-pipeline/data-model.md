# Data Model: URL Embedding Pipeline

**Feature**: 002-url-embedding-pipeline
**Date**: 2025-12-26

## Overview

This document defines the data structures used in the embedding pipeline. All structures are implemented as Python dataclasses or dictionaries within `main.py`.

---

## 1. Page

Represents a crawled page from the Docusaurus book.

```python
@dataclass
class Page:
    url: str              # Full URL of the page
    title: str            # Page title from <h1> or <title>
    module: str           # Module name (from URL path)
    chapter: str          # Chapter name (from URL path)
    content: str          # Clean extracted text content
    html: str             # Raw HTML (optional, for debugging)
```

**Derivation Rules**:
- `module`: Extract from URL path segment (e.g., `/docs/module-1/...` → `module-1`)
- `chapter`: Extract from URL path segment (e.g., `/docs/.../chapter-2` → `chapter-2`)
- `title`: First `<h1>` content, fallback to `<title>` tag

**Validation**:
- `url` must be valid HTTPS URL
- `content` must have > 50 characters (skip otherwise)

---

## 2. Chunk

Represents a segment of extracted text ready for embedding.

```python
@dataclass
class Chunk:
    id: str               # Unique ID (hash of content + url)
    text: str             # Chunk text content
    url: str              # Source page URL
    module: str           # Inherited from Page
    chapter: str          # Inherited from Page
    section: str          # Section heading (if available)
    chunk_index: int      # Position in page (0-indexed)
    token_count: int      # Approximate token count
```

**ID Generation**:
```python
import hashlib
chunk_id = hashlib.md5(f"{url}:{chunk_index}:{text[:100]}".encode()).hexdigest()
```

**Validation**:
- `text` must have 50-2000 characters
- `chunk_index` must be >= 0

---

## 3. VectorRecord

Represents the data stored in Qdrant.

```python
# Qdrant Point structure
{
    "id": str,              # Chunk ID (used as point ID for deduplication)
    "vector": List[float],  # 1024-dimensional embedding
    "payload": {
        "text": str,        # Original chunk text
        "url": str,         # Source URL
        "module": str,      # Module name
        "chapter": str,     # Chapter name
        "section": str,     # Section heading
        "chunk_index": int, # Position in page
        "ingested_at": str  # ISO timestamp
    }
}
```

**Qdrant Collection Config**:
```python
VectorParams(
    size=1024,              # Cohere embed-english-v3.0 dimensions
    distance=Distance.COSINE
)
```

---

## 4. PipelineState

Tracks pipeline progress for resumability.

```python
@dataclass
class PipelineState:
    discovered_urls: List[str]    # All URLs found
    processed_urls: List[str]     # Successfully processed
    failed_urls: List[str]        # Failed with errors
    total_chunks: int             # Total chunks created
    total_vectors: int            # Total vectors stored
```

**Note**: State is logged but not persisted (full re-run is fast enough).

---

## Entity Relationships

```
┌─────────────┐
│    Page     │
│  (1 per URL)│
└──────┬──────┘
       │ 1:N
       ▼
┌─────────────┐
│   Chunk     │
│(N per page) │
└──────┬──────┘
       │ 1:1
       ▼
┌─────────────┐
│VectorRecord │
│ (in Qdrant) │
└─────────────┘
```

---

## Metadata Schema for Qdrant Filtering

The payload structure enables these filter queries:

| Filter | Use Case |
|--------|----------|
| `module == "module-1"` | Get all vectors from a module |
| `chapter == "intro"` | Get all vectors from a chapter |
| `url == "https://..."` | Get all vectors from a page |
| `chunk_index == 0` | Get first chunk of each page |

---

## Data Flow

1. **Discover** → List[url]
2. **Fetch** → Page (per URL)
3. **Extract** → Page.content (clean text)
4. **Chunk** → List[Chunk] (per Page)
5. **Embed** → List[float] (per Chunk, batched)
6. **Store** → VectorRecord (upsert to Qdrant)
