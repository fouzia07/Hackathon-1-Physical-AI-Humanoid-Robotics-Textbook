# Quickstart: Module 2 Digital Twin Simulation (Gazebo & Unity)

## Overview
This quickstart guide will help you set up and run the digital twin simulation modules for the Physical AI & Humanoid Robotics textbook. You'll learn how to work with both Gazebo and Unity simulation environments.

## Prerequisites
- Node.js LTS installed
- Git installed
- Basic familiarity with Docusaurus (covered in Module 1)

## Setup

### 1. Clone and Navigate to the Textbook
```bash
cd ai-textbook
```

### 2. Verify the Module Structure
The digital twin simulation module should be available at:
```
docs/modules/module-2-digital-twin/
├── chapter-1-digital-twins.md
├── chapter-2-gazebo-physics.md
└── chapter-3-sensors-interaction.md
```

### 3. Start the Development Server
```bash
npm start
```

Your textbook will be available at `http://localhost:3000`.

## Chapter Walkthrough

### Chapter 1: Digital Twins
1. Navigate to "Module 2: Digital Twin" in the sidebar
2. Read about digital twin concepts and their applications in robotics
3. Compare Gazebo and Unity simulation platforms
4. Understand when to use each platform for different robotics applications

### Chapter 2: Gazebo Physics
1. Learn about physics simulation fundamentals
2. Configure gravity and collision parameters in Gazebo
3. Set up robot-environment interactions
4. Practice creating realistic physics behaviors

### Chapter 3: Sensors & Interaction
1. Implement sensor simulation (LiDAR, depth cameras, IMU)
2. Explore human-robot interaction in Unity
3. Connect sensor data to AI agents
4. Practice interaction scenarios

## Key Concepts Covered

### Digital Twin Fundamentals
- Virtual representation of physical systems
- Applications in humanoid robotics
- Platform selection criteria (Gazebo vs Unity)

### Physics Simulation
- Gravity configuration
- Collision detection
- Robot-environment interactions
- Realistic behavior modeling

### Sensor Simulation
- LiDAR simulation techniques
- Depth camera implementation
- IMU sensor modeling
- Human-robot interaction scenarios

## Building for Production
When ready to deploy:
```bash
npm run build
```

The built site will be in the `build/` directory and ready for deployment to GitHub Pages.

## Troubleshooting

### Common Issues
1. **Module not appearing in sidebar**: Check that `sidebars.ts` includes the module
2. **Broken links**: Verify all internal links use Docusaurus linking conventions
3. **Build errors**: Ensure all markdown files have proper frontmatter

### Validation
- All content follows Concept → System → Practice flow
- Technical information is accurate and verifiable
- Content structure supports RAG indexing
- Files use proper markdown format