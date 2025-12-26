# Data Model: Book Introduction Content

**Feature**: 004-book-intro-content
**Date**: 2025-12-25
**Status**: Draft

## Entity: Introduction Content

**Definition**: Educational material that explains the book's purpose, structure, and learning journey for Physical AI & Humanoid Robotics

**Attributes**:
- **title**: String - The main title of the introduction (e.g., "Introduction to Physical AI & Humanoid Robotics")
- **contentSections**: Array of content sections in specific order
- **physicalAIDefinition**: Text explaining Physical AI concepts
- **embodiedIntelligenceDefinition**: Text explaining Embodied Intelligence concepts
- **moduleConnections**: Text connecting the four modules (ROS 2, Digital Twins, AI-Robot Brain, VLA)
- **capstoneVision**: Text describing the capstone project expectations
- **targetAudienceLevel**: Enum (undergraduate, graduate) indicating the intended academic level
- **motivationalElements**: Array of content designed to engage and motivate students
- **pedagogicalFlow**: String indicating the Concept → System → Practice structure

**Relationships**:
- Related to Module entities (ROS 2, Digital Twins, AI-Robot Brain, VLA) through moduleConnections attribute
- Related to Capstone Project entity through capstoneVision attribute
- Related to Target Audience entity through targetAudienceLevel attribute

**Validation Rules**:
- Must not contain implementation details or setup instructions (per FR-007, FR-008)
- Must be suitable for undergraduate and early graduate students (per FR-009)
- Must be formatted as Docusaurus Markdown (per FR-005)
- Content must be readable and engaging (per FR-010)

## Entity: Module Connection

**Definition**: Relationship between the four core modules that demonstrates how they form a cohesive system

**Attributes**:
- **sourceModule**: String - The originating module (ROS 2, Digital Twins, AI-Robot Brain, or VLA)
- **targetModule**: String - The module being connected to
- **connectionType**: Enum (foundational, complementary, sequential, parallel) describing the relationship
- **connectionDescription**: Text explaining how the modules relate to each other
- **integrationPoint**: Specific area where modules connect

**Relationships**:
- Connects multiple Module entities together
- Part of Introduction Content entity through moduleConnections attribute

**Validation Rules**:
- Must clearly explain how modules work together (per FR-003)
- Must maintain technical accuracy
- Must be appropriate for target audience level

## Entity: Physical AI Concept

**Definition**: Core concept explaining the nature of Physical AI and how it differs from traditional digital AI

**Attributes**:
- **conceptName**: String - "Physical AI" or "Embodied Intelligence"
- **definition**: Text providing clear, accessible definition
- **differentiation**: Text explaining how it differs from traditional approaches
- **relevance**: Text explaining why this concept is important for the book
- **examples**: Array of examples to illustrate the concept

**Relationships**:
- Part of Introduction Content entity
- Connected to Module Connection entities through foundational concepts
- Related to Capstone Project through practical application

**Validation Rules**:
- Must provide clear definition (per FR-001)
- Must explain transition from digital AI (per FR-002)
- Must be accessible to undergraduate students
- Must maintain technical accuracy

## Entity: Capstone Vision

**Definition**: Description of expectations and goals for the capstone humanoid robotics project

**Attributes**:
- **projectScope**: Text describing the overall scope of the capstone project
- **integrationRequirements**: List of how all four modules integrate in the project
- **expectedOutcomes**: Text describing what students should achieve
- **motivationalElements**: Content designed to inspire and motivate students
- **practicalApplications**: Examples of real-world applications

**Relationships**:
- Part of Introduction Content entity through capstoneVision attribute
- Connected to all Module entities showing how they integrate
- Related to Target Audience entity through expectedOutcomes

**Validation Rules**:
- Must set appropriate expectations for capstone project (per FR-004)
- Must be achievable and inspiring
- Must connect to all four modules
- Must be suitable for target audience level

## Entity: Content Section

**Definition**: Individual section of the introduction content with specific focus and purpose

**Attributes**:
- **sectionTitle**: String - Title of the section
- **sectionType**: Enum (overview, definition, connection, vision, motivational) indicating the section's purpose
- **content**: Text containing the section body
- **position**: Number indicating the order in the introduction
- **targetAudienceLevel**: Enum (undergraduate, graduate) for section-specific targeting
- **pedagogicalStage**: Enum (concept, system, practice) indicating which pedagogical stage it represents

**Relationships**:
- Part of Introduction Content entity as part of contentSections array
- May reference other entities like Physical AI Concept or Module Connection

**Validation Rules**:
- Must align with pedagogical flow principle (Concept → System → Practice)
- Must maintain appropriate audience level
- Must be coherent with other sections
- Must contribute to overall introduction goals