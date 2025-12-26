import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Tutorial',
      items: [
        'tutorial-basics/create-a-document',
        'tutorial-basics/create-a-page',
        'tutorial-basics/deploy-your-site',
      ],
    },
    {
      type: 'category',
      label: 'Module 1: ROS 2',
      items: [
        'modules/module-1-ros2/chapter-1-ros2-fundamentals',
        'modules/module-1-ros2/chapter-2-ros2-communication',
        'modules/module-1-ros2/chapter-3-python-agents-urdf',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Machine Learning for Physical AI',
      items: [
        'modules/module-2/chapter-1-intro-ml-physical-ai',
        'modules/module-2/chapter-2-deep-learning-physical-ai',
        'modules/module-2/chapter-3-reinforcement-learning-physical-ai',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: NVIDIA Isaac for Physical AI',
      items: [
        'modules/module-3-nvidia-isaac/chapter-1-nvidia-isaac-sim',
        'modules/module-3-nvidia-isaac/chapter-2-isaac-ros',
        'modules/module-3-nvidia-isaac/chapter-3-nav2-humanoid-navigation',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action (VLA)',
      items: [
        'modules/module-4-vla/chapter-1-vla-pipelines',
        'modules/module-4-vla/chapter-2-voice-to-action-systems',
        'modules/module-4-vla/chapter-3-capstone-architecture',
      ],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
