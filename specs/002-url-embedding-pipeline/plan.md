# Implementation Plan: URL Embedding Pipeline

**Branch**: `002-url-embedding-pipeline` | **Date**: 2025-12-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-url-embedding-pipeline/spec.md`

## Summary

Build a Python pipeline that crawls a deployed Docusaurus textbook, extracts content, generates Cohere embeddings, and stores vectors in Qdrant Cloud. All logic resides in a single `main.py` file orchestrated by a `main()` function. The pipeline is idempotent and re-runnable.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: requests, beautifulsoup4, cohere, qdrant-client, python-dotenv
**Storage**: Qdrant Cloud (Free Tier) - vector database
**Testing**: Manual verification via Qdrant dashboard and logs
**Target Platform**: Local development (Windows/macOS/Linux)
**Project Type**: Single CLI script
**Performance Goals**: Process full textbook (~50-100 pages) in <30 minutes
**Constraints**: Cohere free tier (1000 calls/month), Qdrant free tier (1GB)
**Scale/Scope**: Single textbook, ~300-500 chunks, ~500KB vectors

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| Spec-driven, deterministic generation | PASS | Pipeline produces identical vectors for identical content (content hash IDs) |
| Technical accuracy and verifiability | PASS | All chunks traceable to source URLs via metadata |
| Clear pedagogical flow | N/A | This is infrastructure, not content |
| Modular, AI-native design | PASS | Vectors optimized for RAG retrieval with structured metadata |
| RAG chatbot integrity | PASS | Embeddings include source URL for citation; only indexed content retrievable |
| Content standards compliance | PASS | Extracts from deployed Docusaurus; no content modification |

## Project Structure

### Documentation (this feature)

```text
specs/002-url-embedding-pipeline/
├── plan.md              # This file
├── research.md          # Technology decisions
├── data-model.md        # Entity definitions
├── quickstart.md        # Setup guide
├── contracts/           # API contracts
│   └── README.md
├── checklists/
│   └── requirements.md  # Quality checklist
└── tasks.md             # (Created by /sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── main.py              # All pipeline logic
├── .env                 # API keys (git-ignored)
├── .env.example         # Template for .env
├── pyproject.toml       # uv project config
└── uv.lock              # Locked dependencies
```

**Structure Decision**: Single `backend/` directory with one `main.py` file. This minimalist structure is appropriate because:
1. Total code is ~300 lines
2. No API endpoints or web interface
3. Single entry point (`uv run python main.py`)
4. Easy to understand, debug, and modify

## Implementation Phases

### Phase 1: Project Setup

**Goal**: Initialize backend directory with uv and dependencies

**Steps**:
1. Create `backend/` directory
2. Initialize uv project: `uv init`
3. Add dependencies: `uv add requests beautifulsoup4 cohere qdrant-client python-dotenv`
4. Create `.env.example` with placeholder keys
5. Add `.env` to `.gitignore`

**Deliverables**:
- `backend/pyproject.toml`
- `backend/uv.lock`
- `backend/.env.example`

---

### Phase 2: URL Discovery

**Goal**: Crawl base URL to discover all textbook pages

**Implementation in `main.py`**:
```python
def discover_urls(base_url: str) -> List[str]:
    """
    1. Fetch base URL
    2. Parse sitemap.xml if available
    3. Fallback: crawl links from homepage
    4. Filter to docs pages only
    5. Return deduplicated URL list
    """
```

**Acceptance**: Returns list of 20+ valid textbook URLs

---

### Phase 3: Content Extraction

**Goal**: Fetch pages and extract clean text with metadata

**Implementation in `main.py`**:
```python
def fetch_page(url: str) -> Optional[Page]:
    """
    1. HTTP GET with timeout
    2. Parse HTML with BeautifulSoup
    3. Extract title from <h1> or <title>
    4. Extract module/chapter from URL path
    5. Return Page dataclass
    """

def extract_content(html: str) -> str:
    """
    1. Find main content (article, .markdown, main)
    2. Remove nav, aside, footer, .sidebar
    3. Preserve code blocks with markers
    4. Return clean text
    """
```

**Acceptance**: Extracts readable text from each page, skips pages <50 chars

---

### Phase 4: Text Chunking

**Goal**: Split content into embedding-ready chunks with metadata

**Implementation in `main.py`**:
```python
CHUNK_SIZE = 2000      # ~500 tokens
CHUNK_OVERLAP = 200    # ~50 tokens

def chunk_content(page: Page) -> List[Chunk]:
    """
    1. Split by paragraphs/sections first
    2. Merge small chunks, split large ones
    3. Apply overlap between chunks
    4. Generate unique ID per chunk (hash)
    5. Attach metadata (url, module, chapter, section, index)
    """
```

**Acceptance**: Each chunk is 200-2000 chars with complete metadata

---

### Phase 5: Embedding Generation

**Goal**: Generate Cohere embeddings in batches

**Implementation in `main.py`**:
```python
BATCH_SIZE = 96  # Cohere API limit

def generate_embeddings(chunks: List[Chunk]) -> List[List[float]]:
    """
    1. Initialize Cohere client from env
    2. Batch chunks into groups of 96
    3. Call co.embed() for each batch
    4. Handle rate limits with exponential backoff
    5. Return flat list of embeddings
    """
```

**Acceptance**: 1024-dim vector for each chunk, no data loss

---

### Phase 6: Vector Storage

**Goal**: Store embeddings with metadata in Qdrant

**Implementation in `main.py`**:
```python
COLLECTION_NAME = "textbook"

def store_vectors(chunks: List[Chunk], embeddings: List[List[float]]) -> int:
    """
    1. Initialize Qdrant client from env
    2. Create/verify collection exists (1024 dims, cosine)
    3. Build points with chunk ID, vector, payload
    4. Upsert in batches of 100
    5. Return count of vectors stored
    """
```

**Acceptance**: All vectors queryable in Qdrant with correct metadata

---

### Phase 7: Pipeline Orchestration

**Goal**: Wire all steps into single `main()` function

**Implementation in `main.py`**:
```python
def main():
    """
    1. Load environment variables
    2. Validate required keys present
    3. discover_urls() → urls
    4. For each url: fetch_page() → pages
    5. For each page: chunk_content() → all_chunks
    6. generate_embeddings(all_chunks) → embeddings
    7. store_vectors(all_chunks, embeddings)
    8. Log summary statistics
    """

if __name__ == "__main__":
    main()
```

**Acceptance**: `uv run python main.py` completes successfully

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Cohere rate limits | Exponential backoff, batch requests |
| Qdrant connection failure | Retry logic, checkpoint progress in logs |
| Malformed HTML | BeautifulSoup handles gracefully |
| Empty pages | Skip with warning, don't fail pipeline |
| Duplicate runs | Content-hash IDs enable idempotent upserts |

## Definition of Done

- [ ] `backend/` directory created with uv project
- [ ] `main.py` implements all 6 functions + `main()`
- [ ] Pipeline runs end-to-end without errors
- [ ] All textbook pages processed (logged)
- [ ] Vectors visible in Qdrant Cloud dashboard
- [ ] Re-run produces no duplicates
- [ ] `.env.example` documents required keys

## Next Steps

Run `/sp.tasks` to generate detailed implementation tasks from this plan.
