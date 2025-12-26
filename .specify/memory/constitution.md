<!-- SYNC IMPACT REPORT
Version change: N/A (initial constitution) → 1.0.0
Modified principles: N/A
Added sections: Core Principles for AI-driven textbook project
Removed sections: N/A
Templates requiring updates:
- ✅ .specify/templates/plan-template.md - Constitution Check section will align with new principles
- ✅ .specify/templates/spec-template.md - Scope/requirements alignment
- ✅ .specify/templates/tasks-template.md - Task categorization reflects new principles
Follow-up TODOs: None
-->

# AI-Driven Textbook Constitution

## Core Principles

### I. Spec-Driven, Deterministic Generation
All textbook content and functionality must follow spec-driven development practices. Generation processes must be deterministic and reproducible, ensuring consistent outputs from identical inputs. This ensures auditability and verifiability of all textbook content.

### II. Technical Accuracy and Verifiability
All content must be technically accurate and verifiable from source materials. No hallucinations or speculative content is allowed. All claims must be traceable to verified sources or be self-evidently correct.

### III. Clear Pedagogical Flow (Concept → System → Practice)
Content must follow a clear pedagogical progression from Concept (theoretical understanding) to System (practical implementation) to Practice (application and reinforcement). Each section must clearly indicate its place in this learning flow.

### IV. Modular, AI-Native Design
The textbook system must be built with modular components that work seamlessly with AI tools. Content and structure should be optimized for AI processing, retrieval, and generation while maintaining human readability.

### V. RAG Chatbot Integrity (NON-NEGOTIABLE)
The integrated RAG chatbot must only respond with information from indexed textbook content. It must reject out-of-scope queries and clearly indicate when information is not available in the source material.

### VI. Content Standards Compliance
All content must strictly adhere to established standards: Markdown format (.md/.mdx), Docusaurus platform compatibility, GitHub Pages deployment readiness, and scope limitation to approved specifications only.

## Additional Constraints
- No assumptions beyond specifications
- No placeholder or speculative content
- Reproducible and auditable outputs only
- Technical accuracy and verifiability required for all content
- Strict adherence to pedagogical flow (Concept → System → Practice)
- AI-native design for optimal RAG integration

## Development Workflow
- All content follows spec-driven development via Spec-Kit Plus
- Claude Code used for AI-assisted generation and maintenance
- Content validation against source materials required
- RAG chatbot integration testing mandatory
- Deployment via Docusaurus → GitHub Pages pipeline
- Book builds and deploys successfully with accurate content retrieval

## Governance

All development must comply with these constitutional principles. Amendments require documentation of reasoning and impact assessment. The constitution supersedes all other practices and serves as the ultimate authority for project decisions.

**Version**: 1.0.0 | **Ratified**: 2025-12-24 | **Last Amended**: 2025-12-24