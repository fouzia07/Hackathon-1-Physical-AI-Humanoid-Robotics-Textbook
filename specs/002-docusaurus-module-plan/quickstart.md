# Quickstart Guide: Docusaurus Module Plan for ROS 2 Textbook

## Prerequisites
- Node.js LTS (v18 or higher)
- npm or yarn package manager
- Git

## Setup Instructions

### 1. Install Docusaurus
```bash
npm init docusaurus@latest my-textbook classic
cd my-textbook
```

### 2. Create Module Directory Structure
```bash
mkdir -p docs/modules/module-1-ros2
```

### 3. Create Chapter Files
Create the following files in the `docs/modules/module-1-ros2/` directory:

- `chapter-1-ros2-fundamentals.md`
- `chapter-2-ros2-communication.md`
- `chapter-3-python-agents-urdf.md`

### 4. Configure Docusaurus
Update `docusaurus.config.js` to include the new modules section in the sidebar:

```javascript
// In docusaurus.config.js
module.exports = {
  // ... other config
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // ... other docs config
        },
        // ... other presets
      },
    ],
  ],
};
```

### 5. Add Module to Sidebar
In `sidebars.js`, add the module-1-ros2 section:

```javascript
// sidebars.js
module.exports = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Module 1: ROS 2',
      items: [
        'modules/module-1-ros2/chapter-1-ros2-fundamentals',
        'modules/module-1-ros2/chapter-2-ros2-communication',
        'modules/module-1-ros2/chapter-3-python-agents-urdf',
      ],
    },
  ],
};
```

### 6. Start Development Server
```bash
npm start
```

## Content Creation Guidelines

### Chapter Structure
Each chapter should follow this template:

```markdown
---
title: "Chapter Title"
description: "Brief description for SEO"
tags: ["ROS2", "textbook", "education"]
learning_objectives:
  - "Understand fundamental concepts"
  - "Apply practical implementations"
  - "Practice with exercises"
summary: "Brief summary of the chapter content"
---

# Chapter Title

## Learning Objectives
- Objective 1
- Objective 2
- Objective 3

## Concept
[Theoretical concepts and principles]

## System
[Practical implementation and system details]

## Practice
[Exercises, examples, and applications]

## Summary
[Chapter summary and key takeaways]
```

### Running the Project
- `npm start`: Start the development server
- `npm build`: Build the static site
- `npm deploy`: Deploy to GitHub Pages (if configured)