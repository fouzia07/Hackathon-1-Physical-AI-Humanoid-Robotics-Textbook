# Tasks: URL Embedding Pipeline

**Input**: Design documents from `/specs/002-url-embedding-pipeline/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Architecture**: Single `backend/main.py` file with all pipeline logic (~300 lines)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize backend directory with uv and dependencies

- [x] T001 Create `backend/` directory at repository root
- [x] T002 Initialize uv project in `backend/`: run `uv init`
- [x] T003 Add dependencies: `uv add requests beautifulsoup4 cohere qdrant-client python-dotenv`
- [x] T004 [P] Create `backend/.env.example` with placeholder API keys:
  ```
  COHERE_API_KEY=your_cohere_api_key_here
  QDRANT_URL=https://your-cluster.qdrant.io
  QDRANT_API_KEY=your_qdrant_api_key_here
  BOOK_BASE_URL=https://your-site.github.io/textbook
  ```
- [x] T005 [P] Add `.env` to `backend/.gitignore`
- [x] T006 Create empty `backend/main.py` with imports and logging setup:
  ```python
  import os
  import logging
  import hashlib
  from dataclasses import dataclass
  from typing import List, Optional

  import requests
  from bs4 import BeautifulSoup
  import cohere
  from qdrant_client import QdrantClient
  from qdrant_client.models import VectorParams, Distance, PointStruct
  from dotenv import load_dotenv

  logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
  logger = logging.getLogger(__name__)
  ```

**Checkpoint**: `uv sync` succeeds, `backend/main.py` runs without import errors

---

## Phase 2: Foundational (Data Structures & Configuration)

**Purpose**: Define data classes and configuration constants

- [x] T007 Add configuration constants to `backend/main.py`:
  ```python
  CHUNK_SIZE = 2000       # ~500 tokens
  CHUNK_OVERLAP = 200     # ~50 tokens
  BATCH_SIZE = 96         # Cohere API limit
  COLLECTION_NAME = "textbook"
  ```
- [x] T008 Add `Page` dataclass to `backend/main.py`:
  ```python
  @dataclass
  class Page:
      url: str
      title: str
      module: str
      chapter: str
      content: str
  ```
- [x] T009 Add `Chunk` dataclass to `backend/main.py`:
  ```python
  @dataclass
  class Chunk:
      id: str
      text: str
      url: str
      module: str
      chapter: str
      section: str
      chunk_index: int
  ```

**Checkpoint**: Dataclasses can be instantiated without errors

---

## Phase 3: User Story 1 - Ingest Book Content (Priority: P1) 🎯 MVP

**Goal**: Crawl and extract clean textual content from deployed Docusaurus textbook

**Independent Test**: Run `discover_urls()` and `fetch_page()` on a sample URL, verify content extraction

### Implementation for User Story 1

- [x] T010 [US1] Implement `discover_urls(base_url: str) -> List[str]` in `backend/main.py`:
  - Fetch base URL with requests
  - Try to parse sitemap.xml if available
  - Fallback: extract all `<a href>` links from homepage
  - Filter to docs/content pages only (exclude assets, external links)
  - Return deduplicated list of URLs
  - Log count of discovered URLs

- [x] T011 [US1] Implement `extract_content(soup: BeautifulSoup) -> str` in `backend/main.py`:
  - Find main content container: `article`, `.markdown`, `main`, or `.docusaurus-content`
  - Remove unwanted elements: `nav`, `aside`, `footer`, `.sidebar`, `.navbar`, `script`, `style`
  - Preserve code blocks with `[CODE]...[/CODE]` markers
  - Get text with proper spacing
  - Return cleaned text string

- [x] T012 [US1] Implement `fetch_page(url: str) -> Optional[Page]` in `backend/main.py`:
  - HTTP GET with 10-second timeout
  - Handle connection errors gracefully (return None, log warning)
  - Parse HTML with BeautifulSoup
  - Extract title from `<h1>` or `<title>`
  - Extract module/chapter from URL path segments
  - Call `extract_content()` for clean text
  - Skip if content < 50 characters
  - Return `Page` dataclass or None

- [x] T013 [US1] Add error handling and logging for URL discovery and page fetching:
  - Log each URL being processed
  - Log warnings for failed fetches
  - Log summary: X pages discovered, Y successfully fetched, Z failed

**Checkpoint**: Can run `discover_urls()` on a Docusaurus site and get 20+ URLs. Can run `fetch_page()` on individual URLs and get clean text content.

---

## Phase 4: User Story 2 - Generate Semantic Embeddings (Priority: P2)

**Goal**: Chunk content and generate Cohere embeddings in batches

**Independent Test**: Provide sample Page objects, verify chunks are created and embeddings generated

**Depends on**: User Story 1 (needs Page objects with content)

### Implementation for User Story 2

- [x] T014 [US2] Implement `chunk_content(page: Page) -> List[Chunk]` in `backend/main.py`:
  - Split content by double newlines (paragraphs)
  - Merge small paragraphs until CHUNK_SIZE reached
  - Split large paragraphs at CHUNK_SIZE with CHUNK_OVERLAP
  - Generate unique chunk ID using MD5 hash of `url:index:text[:100]`
  - Extract section heading if present (nearest `#` header)
  - Create `Chunk` dataclass for each segment
  - Return list of chunks with metadata

- [x] T015 [US2] Implement `generate_embeddings(chunks: List[Chunk]) -> List[List[float]]` in `backend/main.py`:
  - Initialize Cohere client from `COHERE_API_KEY` env var
  - Split chunks into batches of BATCH_SIZE (96)
  - For each batch:
    - Extract text from chunks
    - Call `co.embed(texts=..., model="embed-english-v3.0", input_type="search_document")`
    - Handle rate limits with exponential backoff (1s, 2s, 4s, max 3 retries)
  - Flatten all embeddings into single list
  - Log progress: batch X of Y complete
  - Return list of 1024-dim vectors

- [x] T016 [US2] Add validation for embedding generation:
  - Verify embedding count matches chunk count
  - Verify each embedding has exactly 1024 dimensions
  - Log warning if any mismatch detected

**Checkpoint**: Can create chunks from Pages with proper metadata. Can generate embeddings for all chunks with no data loss.

---

## Phase 5: User Story 3 - Store Vectors in Cloud Database (Priority: P3)

**Goal**: Store embeddings with metadata in Qdrant Cloud

**Independent Test**: Upload sample embeddings, verify queryable in Qdrant dashboard

**Depends on**: User Story 2 (needs embeddings)

### Implementation for User Story 3

- [x] T017 [US3] Implement `init_qdrant() -> QdrantClient` in `backend/main.py`:
  - Initialize client from `QDRANT_URL` and `QDRANT_API_KEY` env vars
  - Check if collection exists
  - If not, create collection with:
    - `vectors_config=VectorParams(size=1024, distance=Distance.COSINE)`
  - Log collection status
  - Return configured client

- [x] T018 [US3] Implement `store_vectors(client: QdrantClient, chunks: List[Chunk], embeddings: List[List[float]]) -> int` in `backend/main.py`:
  - Build PointStruct for each chunk/embedding pair:
    - `id`: chunk.id (string hash for idempotent upserts)
    - `vector`: embedding
    - `payload`: {text, url, module, chapter, section, chunk_index, ingested_at}
  - Upsert in batches of 100 points
  - Log progress: batch X of Y stored
  - Return total count of vectors stored

- [x] T019 [US3] Add verification for vector storage:
  - Query collection info after upsert
  - Verify `points_count` matches expected
  - Log final count and collection stats

**Checkpoint**: Can store vectors in Qdrant. Vectors visible in Qdrant Cloud dashboard with correct metadata.

---

## Phase 6: User Story 4 - Incremental Pipeline Re-runs (Priority: P4)

**Goal**: Enable idempotent re-runs without duplicates

**Independent Test**: Run pipeline twice, verify vector count unchanged

**Depends on**: User Stories 1-3 complete

### Implementation for User Story 4

- [x] T020 [US4] Verify idempotent behavior in `store_vectors()`:
  - Upsert operation naturally handles duplicates (same ID = overwrite)
  - Content hash ID ensures identical content gets same ID
  - Log "updated" vs "new" count if detectable

- [x] T021 [US4] Add summary logging at end of pipeline:
  - Total pages discovered
  - Total pages successfully processed
  - Total chunks created
  - Total vectors stored
  - Time elapsed

**Checkpoint**: Running pipeline twice on same content produces no duplicate vectors. Log output shows incremental behavior.

---

## Phase 7: Pipeline Orchestration

**Purpose**: Wire all components into single `main()` function

- [x] T022 Implement `main()` function in `backend/main.py`:
  ```python
  def main():
      load_dotenv()

      # Validate environment
      required = ["COHERE_API_KEY", "QDRANT_URL", "QDRANT_API_KEY", "BOOK_BASE_URL"]
      missing = [k for k in required if not os.getenv(k)]
      if missing:
          logger.error(f"Missing required env vars: {missing}")
          return

      base_url = os.getenv("BOOK_BASE_URL")
      logger.info(f"Starting pipeline for {base_url}")

      # Step 1: Discover URLs
      urls = discover_urls(base_url)
      logger.info(f"Discovered {len(urls)} pages")

      # Step 2: Fetch and extract content
      pages = []
      for url in urls:
          page = fetch_page(url)
          if page:
              pages.append(page)
      logger.info(f"Extracted content from {len(pages)} pages")

      # Step 3: Chunk content
      all_chunks = []
      for page in pages:
          chunks = chunk_content(page)
          all_chunks.extend(chunks)
      logger.info(f"Created {len(all_chunks)} chunks")

      # Step 4: Generate embeddings
      embeddings = generate_embeddings(all_chunks)
      logger.info(f"Generated {len(embeddings)} embeddings")

      # Step 5: Store in Qdrant
      client = init_qdrant()
      count = store_vectors(client, all_chunks, embeddings)
      logger.info(f"Stored {count} vectors in Qdrant")

      logger.info("Pipeline complete!")
  ```

- [x] T023 Add `if __name__ == "__main__"` block to `backend/main.py`:
  ```python
  if __name__ == "__main__":
      main()
  ```

- [ ] T024 End-to-end test: Run `uv run python main.py` with real credentials:
  - Verify no errors
  - Verify vectors appear in Qdrant dashboard
  - Verify metadata is correct

**Checkpoint**: Full pipeline runs end-to-end. All success criteria from spec met.

---

## Phase 8: Polish & Documentation

**Purpose**: Final cleanup and documentation

- [x] T025 [P] Update `backend/.env.example` with comments explaining each variable
- [x] T026 [P] Add inline code comments for complex logic (chunking, batching)
- [ ] T027 Verify `specs/002-url-embedding-pipeline/quickstart.md` is accurate
- [ ] T028 Run pipeline on actual textbook, capture final statistics

---

## Dependencies & Execution Order

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational)
    ↓
Phase 3 (US1: Content Ingestion) ← MVP complete here
    ↓
Phase 4 (US2: Embeddings)
    ↓
Phase 5 (US3: Vector Storage)
    ↓
Phase 6 (US4: Incremental)
    ↓
Phase 7 (Orchestration)
    ↓
Phase 8 (Polish)
```

### Parallel Opportunities

Within each phase, tasks marked `[P]` can run in parallel:
- T004, T005 (env files)
- T025, T026, T027 (documentation)

### Single-File Constraint

All implementation tasks (T010-T023) modify the same file `backend/main.py`. These must be executed sequentially to avoid conflicts.

---

## Definition of Done

- [x] `backend/` directory exists with uv project
- [ ] `uv run python main.py` completes without errors
- [ ] All textbook pages discovered and processed
- [ ] Vectors visible in Qdrant Cloud dashboard
- [ ] Each vector has complete metadata (url, module, chapter, section)
- [ ] Re-run produces no duplicates
- [x] `.env.example` documents all required keys
