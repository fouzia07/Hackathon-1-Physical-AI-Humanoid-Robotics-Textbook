# Data Model: Docusaurus Module Plan for ROS 2 Textbook

## Chapter Entity
- **name**: String (e.g., "ROS 2 Fundamentals", "ROS 2 Communication", "Python Agents & URDF")
- **path**: String (e.g., "modules/module-1-ros2/chapter-1-ros2-fundamentals.md")
- **contentStructure**: Enum ["Concept", "System", "Practice"]
- **learningObjectives**: Array of String
- **summary**: String
- **headings**: Array of String (for RAG indexing)
- **createdAt**: Date
- **updatedAt**: Date

## Module Entity
- **id**: String (e.g., "module-1-ros2")
- **title**: String ("Module 1: ROS 2 for Physical AI & Humanoid Robotics")
- **chapters**: Array of Chapter entities
- **description**: String
- **createdAt**: Date
- **updatedAt**: Date

## Educational Content Structure
Each chapter file follows this structure:
```
---
title: [Chapter Title]
description: [Brief description for SEO]
tags: [Educational tags]
learning_objectives:
  - [Objective 1]
  - [Objective 2]
  - [Objective 3]
summary: [Chapter summary]
---

# [Chapter Title]

## Learning Objectives
- [List of learning objectives]

## Concept
[Theoretical concepts and principles]

## System
[Practical implementation and system details]

## Practice
[Exercises, examples, and applications]

## Summary
[Chapter summary and key takeaways]
```

## Validation Rules
- Each chapter must contain all three sections: Concept, System, Practice
- All content files must use .md extension
- Each file must include learning objectives and summary sections
- Headings must follow a consistent hierarchy for proper indexing
- Content must be technically accurate and verifiable