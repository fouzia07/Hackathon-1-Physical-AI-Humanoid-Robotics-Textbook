# Quickstart: URL Embedding Pipeline

**Feature**: 002-url-embedding-pipeline
**Date**: 2025-12-26

## Prerequisites

- Python 3.11+
- [uv](https://github.com/astral-sh/uv) package manager
- Cohere API key ([get free key](https://dashboard.cohere.com/api-keys))
- Qdrant Cloud account ([free tier](https://cloud.qdrant.io/))

---

## Setup

### 1. Initialize Project

```bash
cd backend
uv sync
```

### 2. Configure Environment

Create `.env` file in `backend/`:

```env
COHERE_API_KEY=your_cohere_api_key_here
QDRANT_URL=https://your-cluster-id.us-east4-0.gcp.cloud.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key_here
BOOK_BASE_URL=https://your-username.github.io/your-textbook
```

### 3. Get Your API Keys

**Cohere**:
1. Go to https://dashboard.cohere.com/api-keys
2. Create a new API key
3. Copy to `COHERE_API_KEY`

**Qdrant Cloud**:
1. Go to https://cloud.qdrant.io/
2. Create a free cluster
3. Copy the cluster URL to `QDRANT_URL`
4. Generate an API key and copy to `QDRANT_API_KEY`

---

## Usage

### Run Full Pipeline

```bash
cd backend
uv run python main.py
```

### Expected Output

```
2025-12-26 10:00:00 - INFO - Starting URL Embedding Pipeline
2025-12-26 10:00:01 - INFO - Discovered 45 pages from https://...
2025-12-26 10:00:05 - INFO - Extracted content from 45 pages
2025-12-26 10:00:06 - INFO - Created 312 chunks
2025-12-26 10:00:15 - INFO - Generated embeddings for 312 chunks
2025-12-26 10:00:20 - INFO - Stored 312 vectors in Qdrant
2025-12-26 10:00:20 - INFO - Pipeline complete!
```

---

## Verification

### Check Vector Count in Qdrant

```python
from qdrant_client import QdrantClient
import os
from dotenv import load_dotenv

load_dotenv()
client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

info = client.get_collection("textbook")
print(f"Vectors stored: {info.points_count}")
```

### Test a Sample Query (for debugging only)

```python
# Quick test - not part of this feature
results = client.search(
    collection_name="textbook",
    query_vector=embeddings[0],  # Use any embedding
    limit=3
)
for r in results:
    print(f"Score: {r.score:.3f} | {r.payload['url']}")
```

---

## Re-running the Pipeline

The pipeline is idempotent. Running it again will:
- Skip unchanged content (same content hash)
- Update changed content (upsert by ID)
- Not create duplicates

```bash
# Safe to run multiple times
uv run python main.py
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `COHERE_API_KEY not set` | Check `.env` file exists and has valid key |
| `Connection refused` | Verify `QDRANT_URL` is correct |
| `Rate limit exceeded` | Wait 1 minute, pipeline has backoff |
| `Empty content` | Check `BOOK_BASE_URL` is accessible |

---

## Project Structure

```
backend/
├── main.py           # All pipeline logic
├── .env              # API keys (not in git)
├── .env.example      # Template for .env
├── pyproject.toml    # Dependencies
└── uv.lock           # Locked versions
```
