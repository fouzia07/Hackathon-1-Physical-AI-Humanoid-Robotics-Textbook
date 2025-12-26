---
id: 1
title: Create Constitution
stage: constitution
date: 2025-12-24
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: DELL
command: /sp.constitution
labels: ["constitution", "governance", "spec-driven"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
 - .specify/templates/plan-template.md
 - .specify/templates/spec-template.md
 - .specify/templates/tasks-template.md
tests:
---

## Prompt

# /sp.constitution

## Project
AI-driven textbook with integrated RAG chatbot, built using **Spec-Kit Plus** and **Claude Code**, published via **Docusaurus → GitHub Pages**.

---

## Core Principles
- Spec-driven, deterministic generation
- Technical accuracy and verifiability
- Clear pedagogical flow (Concept → System → Practice)
- Modular, AI-native design

---

## Book Standards
- Format: Markdown (`.md/.mdx`)
- Platform: Docusaurus
- Deployment: GitHub Pages
- Scope strictly limited to approved specs
- No hallucinations or marketing language

---

## RAG Chatbot Standards
- Stack: OpenAI Agents/ChatKit, FastAPI, Neon Postgres, Qdrant Cloud
- Answers only from indexed book content
- Supports user-selected text–only responses
- Rejects out-of-scope queries

---

## Constraints
- No assumptions beyond specs
- No placeholder or speculative content
- Reproducible and auditable outputs only

---

## Success Criteria
- Book builds and deploys successfully
- Chatbot retrieves and answers accurately from

## Response snapshot

The project constitution has been successfully updated with the following details:

**New Version**: 1.0.0 (Initial version)
**Bump Rationale**: This is the initial constitution for the AI-driven textbook project, establishing core principles and governance for the project.

**Files Updated**:
1. `.specify/memory/constitution.md` - The main constitution file with all 6 core principles
2. `.specify/templates/plan-template.md` - Updated Constitution Check section to align with new principles
3. `.specify/templates/spec-template.md` - Updated Success Criteria to align with constitution
4. `.specify/templates/tasks-template.md` - Updated cross-cutting concerns to reflect constitutional principles

**Constitution Summary**:
- **Core Principles**: 6 key principles established (Spec-driven generation, Technical accuracy, Pedagogical flow, AI-native design, RAG integrity, Content standards)
- **Constraints**: No assumptions beyond specs, reproducible outputs, technical accuracy
- **Workflow**: Spec-Kit Plus and Claude Code for AI-assisted generation
- **Governance**: Constitution supersedes all other practices

**Suggested Commit Message**:
`docs: create project constitution v1.0.0 for AI-driven textbook`

The constitution is now ready and all related templates have been updated to maintain consistency with the new principles.

## Outcome

- ✅ Impact: Created initial project constitution with 6 core principles and updated related templates
- 🧪 Tests: No tests required for constitution creation
- 📁 Files: 4 files updated to maintain consistency with new constitution
- 🔁 Next prompts: Project can now proceed with spec-driven development
- 🧠 Reflection: Constitution establishes clear governance for the AI-driven textbook project

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin feature specification using new constitution