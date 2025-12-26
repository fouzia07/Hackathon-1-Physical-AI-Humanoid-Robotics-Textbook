---
title: "Chapter 3 - Python Agents & URDF"
description: "Connecting Python agents to humanoid robots using rclpy and URDF"
tags: ["ROS2", "textbook", "education", "python", "urdf"]
learning_objectives:
  - "Understand how to create Python agents with rclpy"
  - "Learn about URDF for humanoid robot structure"
  - "Connect AI control to robot actuation"
summary: "This chapter covers creating Python agents with rclpy and using URDF for humanoid robot structure to connect AI agents to humanoid models."
---

# Chapter 3 - Python Agents & URDF

## Learning Objectives
- Understand how to create Python agents with rclpy
- Learn about URDF for humanoid robot structure
- Connect AI control to robot actuation

## Concept
Python agents in ROS 2 are programs written in Python that interact with the ROS 2 ecosystem using the rclpy client library. These agents can perform AI-based decision making and control robot behaviors. URDF (Unified Robot Description Format) is an XML format used to describe robot models, including their kinematic and dynamic properties.

### Python Agents with rclpy
rclpy is the Python client library for ROS 2. It provides the necessary interfaces to create nodes, publish and subscribe to topics, provide and use services, and work with actions.

### URDF (Unified Robot Description Format)
URDF is XML-based format that describes robot models. It includes:
- Kinematic structure (joint connections)
- Visual and collision properties
- Inertial properties
- Physical dimensions and materials

### AI Control vs Robot Actuation
AI control refers to the high-level decision-making processes that determine what the robot should do, while robot actuation refers to the low-level processes that make the robot actually move and perform actions.

## System
Let's look at how to implement Python agents that interact with URDF-described robots:

### Basic Python Agent with rclpy
```python
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState
from trajectory_msgs.msg import JointTrajectory, JointTrajectoryPoint

class RobotController(Node):
    def __init__(self):
        super().__init__('robot_controller')

        # Publisher for joint trajectories
        self.joint_pub = self.create_publisher(JointTrajectory, '/joint_trajectory', 10)

        # Subscriber for joint states
        self.joint_sub = self.create_subscription(
            JointState,
            '/joint_states',
            self.joint_state_callback,
            10
        )

        # Timer for control loop
        self.timer = self.create_timer(0.1, self.control_loop)

        self.current_joint_states = None

    def joint_state_callback(self, msg):
        self.current_joint_states = msg

    def control_loop(self):
        # AI decision making would go here
        # For now, we'll send a simple trajectory
        traj_msg = JointTrajectory()
        traj_msg.joint_names = ['joint1', 'joint2', 'joint3']  # Example joint names

        point = JointTrajectoryPoint()
        point.positions = [0.0, 0.0, 0.0]  # Example positions
        point.time_from_start.sec = 1
        traj_msg.points.append(point)

        self.joint_pub.publish(traj_msg)
```

### URDF Example for Humanoid Robot
```xml
<?xml version="1.0"?>
<robot name="simple_humanoid">
  <!-- Base link -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.2 0.2 0.2"/>
      </geometry>
    </visual>
  </link>

  <!-- Hip joint and torso -->
  <joint name="hip_joint" type="fixed">
    <parent link="base_link"/>
    <child link="torso"/>
  </joint>

  <link name="torso">
    <visual>
      <geometry>
        <box size="0.1 0.2 0.4"/>
      </geometry>
    </visual>
  </link>

  <!-- Head -->
  <joint name="neck_joint" type="revolute">
    <parent link="torso"/>
    <child link="head"/>
    <axis xyz="0 1 0"/>
    <limit lower="-0.5" upper="0.5" effort="100" velocity="1"/>
  </joint>

  <link name="head">
    <visual>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
    </visual>
  </link>

  <!-- Left arm -->
  <joint name="left_shoulder_joint" type="revolute">
    <parent link="torso"/>
    <child link="left_upper_arm"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" effort="100" velocity="1"/>
  </joint>

  <link name="left_upper_arm">
    <visual>
      <geometry>
        <box size="0.05 0.2 0.05"/>
      </geometry>
    </visual>
  </link>
</robot>
```

## Practice
Now let's practice connecting Python agents to humanoid models.

### Exercise 1: Simple Joint Controller
Create a Python agent that controls a simple robot arm with position commands.

### Exercise 2: URDF Parser
Write a Python script that parses a URDF file and extracts joint information.

### Exercise 3: AI-Controlled Robot
Implement a simple AI controller that makes decisions based on sensor data and controls a humanoid robot model.

## Summary
In this chapter, we've covered creating Python agents with rclpy and using URDF for humanoid robot structure. We've learned how to connect AI control to robot actuation, enabling AI agents to interact with physical (or simulated) robots. Through practical examples and exercises, we've seen how to implement these concepts in ROS 2 systems.