# Research: URL Embedding Pipeline

**Feature**: 002-url-embedding-pipeline
**Date**: 2025-12-26
**Status**: Complete

## 1. Project Setup: uv Package Manager

**Decision**: Use `uv` for Python project initialization and dependency management

**Rationale**:
- 10-100x faster than pip for dependency resolution
- Built-in virtual environment management (`.venv/`)
- Lockfile support (`uv.lock`) for reproducible builds
- Single tool replaces pyenv + venv + pip + pip-tools

**Configuration**:
```bash
uv init backend
cd backend
uv add requests beautifulsoup4 cohere qdrant-client python-dotenv
```

**Alternatives Considered**:
- pip + venv: Slower, no lockfile by default
- Poetry: More complex, slower resolution
- Pipenv: Less active development

---

## 2. Web Scraping: Content Extraction

**Decision**: Use `requests` + `BeautifulSoup4` for HTML fetching and parsing

**Rationale**:
- requests: Simple, synchronous HTTP client (sufficient for ~50-100 pages)
- BeautifulSoup4: Excellent for navigating HTML DOM, handles malformed HTML
- Docusaurus uses semantic HTML with predictable structure

**Docusaurus Content Selectors**:
- Main content: `article` or `div.markdown` or `main`
- Title: `h1` or `header h1`
- Navigation to skip: `nav`, `aside`, `footer`, `.navbar`, `.sidebar`

**Alternatives Considered**:
- httpx/aiohttp: Async unnecessary for small page count
- Scrapy: Overkill for single-site static content
- lxml: Faster but less forgiving of HTML issues

---

## 3. Text Chunking Strategy

**Decision**: Recursive character splitting with 512 token target, 50 token overlap

**Rationale**:
- 512 tokens balances context retention with embedding quality
- 50 token overlap (~10%) preserves cross-chunk context
- Character-based splitting simpler than semantic chunking for structured content
- Code blocks preserved as atomic units when possible

**Implementation**:
```python
CHUNK_SIZE = 2000  # ~500 tokens at 4 chars/token
CHUNK_OVERLAP = 200  # ~50 tokens
```

**Alternatives Considered**:
- Sentence-based: Inconsistent chunk sizes
- Semantic chunking (langchain): Added dependency, marginal benefit
- Fixed token count: Requires tokenizer dependency

---

## 4. Embedding Model: Cohere

**Decision**: Use `embed-english-v3.0` with `input_type="search_document"`

**Rationale**:
- Best-in-class for English document retrieval
- 1024 dimensions (good balance of quality vs storage)
- Native support for document vs query embedding types
- Free tier: 1000 API calls/month (sufficient for initial ingestion)

**Configuration**:
```python
import cohere
co = cohere.Client(api_key=os.getenv("COHERE_API_KEY"))
embeddings = co.embed(
    texts=chunks,
    model="embed-english-v3.0",
    input_type="search_document"
)
```

**Batching**: 96 texts per request (API limit)

**Alternatives Considered**:
- embed-multilingual-v3.0: Unnecessary for English-only content
- OpenAI text-embedding-3-small: Higher cost, no free tier
- Sentence-transformers local: Slower, requires GPU for speed

---

## 5. Vector Storage: Qdrant Cloud

**Decision**: Use Qdrant Cloud Free Tier with cosine similarity

**Rationale**:
- Free tier: 1GB storage, ~1M vectors (more than sufficient)
- Native Python client with simple API
- Supports payload filtering for metadata queries
- Upsert operation enables idempotent ingestion

**Configuration**:
```python
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance

client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

client.recreate_collection(
    collection_name="textbook",
    vectors_config=VectorParams(size=1024, distance=Distance.COSINE)
)
```

**Deduplication Strategy**: Use content hash as point ID for idempotent upserts

**Alternatives Considered**:
- Pinecone: More expensive, similar features
- Weaviate: More complex setup
- ChromaDB: No managed cloud free tier
- Local Qdrant: Requires infrastructure management

---

## 6. Single-File Architecture

**Decision**: All pipeline logic in single `main.py` with `main()` orchestrator

**Rationale**:
- Simpler to understand and debug
- No import complexity
- Easy to run: `uv run python main.py`
- Appropriate for ~300 lines of code

**Structure**:
```python
# main.py
# 1. Configuration & clients
# 2. URL discovery functions
# 3. Content extraction functions
# 4. Chunking functions
# 5. Embedding functions
# 6. Vector storage functions
# 7. main() orchestrator
```

**Alternatives Considered**:
- Multi-module: Unnecessary complexity for scope
- CLI framework (click/typer): Not needed for single entry point

---

## 7. Environment Configuration

**Decision**: Use `.env` file with `python-dotenv`

**Required Variables**:
```
COHERE_API_KEY=your_cohere_api_key
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key
BOOK_BASE_URL=https://your-docusaurus-site.github.io
```

**Rationale**:
- Industry standard for local development
- Easy to configure without code changes
- `.env` excluded from git via `.gitignore`

---

## 8. Error Handling & Logging

**Decision**: Python `logging` module with structured output

**Rationale**:
- Built-in, no dependencies
- Configurable verbosity
- Timestamps for debugging

**Implementation**:
```python
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
```

---

## Summary of Technology Choices

| Component | Choice | Version/Model |
|-----------|--------|---------------|
| Language | Python | 3.11+ |
| Package Manager | uv | latest |
| HTTP Client | requests | 2.31+ |
| HTML Parser | BeautifulSoup4 | 4.12+ |
| Embeddings | Cohere | embed-english-v3.0 |
| Vector DB | Qdrant Cloud | Free tier |
| Config | python-dotenv | 1.0+ |
