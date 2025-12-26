---
title: "Chapter 3 - Nav2 for Humanoid Navigation"
description: "Understanding path planning and navigation for bipedal robots with Nav2"
tags: ["Nav2", "Navigation", "Path Planning", "Humanoid Robots", "textbook", "education", "Physical AI", "Bipedal Navigation"]
learning_objectives:
  - "Understand path planning concepts in Nav2"
  - "Learn about navigation for bipedal robots"
  - "Explore obstacle avoidance strategies"
summary: "This chapter explores Nav2 for path planning and navigation, specifically adapted for humanoid and bipedal robots with unique locomotion constraints."
---

# Chapter 3 - Nav2 for Humanoid Navigation

## Learning Objectives
- Understand path planning concepts in Nav2
- Learn about navigation for bipedal robots
- Explore obstacle avoidance strategies

## Concept
Navigation2 (Nav2) is the navigation stack for ROS 2 that provides path planning, motion planning, and obstacle avoidance capabilities. For humanoid robots, Nav2 requires special considerations due to the unique locomotion patterns and stability requirements of bipedal systems.

### Path Planning Algorithms in Nav2
Nav2 implements various sophisticated path planning algorithms specifically adapted for humanoid navigation:
- **Global planners**: A*, Dijkstra, NavFn, and custom implementations for long-term path planning
- **Local planners**: DWA, TEB, MPC for dynamic path following with stability constraints
- **Costmap management for obstacle representation**: Layered costmaps for static and dynamic obstacle representation
- **Dynamic reconfiguration for adaptive planning**: Runtime parameter adjustments for changing conditions

### Humanoid Navigation Challenges
Humanoid robots present unique navigation challenges that require specialized solutions:
- **Stability constraints during locomotion**: Maintaining balance during movement execution
- **Limited turning radius and movement patterns**: Constrained by bipedal gait mechanics
- **Balance preservation during navigation**: Ensuring center of mass remains within support polygon
- **Dynamic obstacle avoidance with fall prevention**: Prioritizing safety over path optimality

### Obstacle Avoidance Strategies
Nav2 provides multiple layers of obstacle avoidance specifically tailored for humanoid systems:
- **Static obstacle avoidance using costmaps**: Pre-computed obstacle maps for path planning
- **Dynamic obstacle prediction and avoidance**: Real-time obstacle detection and prediction
- **Recovery behaviors for navigation failures**: Safe fallback strategies for navigation errors
- **Footstep planning for bipedal locomotion**: Integration with footstep planners for stable stepping

## System
Nav2 for humanoid robots often requires custom plugins and behavior trees to handle the unique constraints of bipedal locomotion. The system architecture includes:

### Core Navigation Components
- **BT Navigator**: Behavior tree-based navigation executor
- **Controller Server**: Local path following with stability constraints
- **Planner Server**: Global path planning with humanoid-aware algorithms
- **Recovery Server**: Recovery behaviors for navigation failures

### Nav2 Configuration for Humanoid Robots
```yaml
# Example Nav2 configuration for humanoid robot
bt_navigator:
  ros__parameters:
    use_sim_time: True
    global_frame: map
    robot_base_frame: base_link
    odom_topic: /odom
    bt_loop_duration: 10
    default_server_timeout: 20
    enable_groot_monitoring: True
    groot_zmq_publisher_port: 1666
    groot_zmq_server_port: 1667
    default_nav_through_poses_bt_xml: "nav2_bt_xml_v0/nav_through_poses_w_replanning_and_recovery.xml"
    default_nav_to_pose_bt_xml: "nav2_bt_xml_v0/nav_to_pose_w_replanning_and_recovery.xml"
    plugin_lib_names:
      - nav2_compute_path_to_pose_action_bt_node
      - nav2_compute_path_through_poses_action_bt_node
      - nav2_smooth_path_action_bt_node
      - nav2_follow_path_action_bt_node
      - nav2_spin_action_bt_node
      - nav2_wait_action_bt_node
      - nav2_assisted_teleop_action_bt_node
      - nav2_back_up_action_bt_node
      - nav2_drive_on_heading_bt_node
      - nav2_clear_costmap_service_bt_node
      - nav2_is_stuck_condition_bt_node
      - nav2_goal_reached_condition_bt_node
      - nav2_goal_updated_condition_bt_node
      - nav2_globally_updated_goal_condition_bt_node
      - nav2_is_path_valid_condition_bt_node
      - nav2_initial_pose_received_condition_bt_node
      - nav2_reinitialize_global_localization_service_bt_node
      - nav2_rate_controller_bt_node
      - nav2_distance_controller_bt_node
      - nav2_speed_controller_bt_node
      - nav2_truncate_path_action_bt_node
      - nav2_truncate_path_local_action_bt_node
      - nav2_goal_updater_node_bt_node
      - nav2_recovery_node_bt_node
      - nav2_pipeline_sequence_bt_node
      - nav2_round_robin_node_bt_node
      - nav2_transform_available_condition_bt_node
      - nav2_time_expired_condition_bt_node
      - nav2_path_expiring_timer_condition
      - nav2_distance_traveled_condition_bt_node
      - nav2_single_trigger_bt_node
      - nav2_is_battery_low_condition_bt_node
      - nav2_navigate_through_poses_action_bt_node
      - nav2_navigate_to_pose_action_bt_node
      - nav2_remove_passed_goals_action_bt_node
      - nav2_planner_selector_bt_node
      - nav2_controller_selector_bt_node
      - nav2_goal_checker_selector_bt_node
      - nav2_controller_cancel_bt_node
      - nav2_path_longer_on_approach_bt_node
      - nav2_wait_cancel_bt_node
      - nav2_spin_cancel_bt_node
      - nav2_back_up_cancel_bt_node
      - nav2_assisted_teleop_cancel_bt_node
      - nav2_drive_on_heading_cancel_bt_node

controller_server:
  ros__parameters:
    use_sim_time: True
    controller_frequency: 20.0
    min_x_velocity_threshold: 0.001
    min_y_velocity_threshold: 0.5
    min_theta_velocity_threshold: 0.001
    progress_checker_plugin: "progress_checker"
    goal_checker_plugin: "goal_checker"
    controller_plugins: ["FollowPath"]

    # Humanoid-specific controller
    FollowPath:
      plugin: "nav2_mppi_controller::MPPIController"
      time_steps: 50
      model_dt: 0.05
      batch_size: 1000
      vx_std: 0.2
      vy_std: 0.1
      wz_std: 0.4
      vx_max: 0.4
      vx_min: -0.2
      vy_max: 0.1
      vy_min: -0.1
      wz_max: 0.4
      wz_min: -0.4
      vx_scale: 1.0
      vy_scale: 1.0
      wz_scale: 1.0
      xy_goal_tolerance: 0.25
      yaw_goal_tolerance: 0.25
      stateful: true
      model_plugin: "HumanoidModel"
      critic_plugins: ["BaseObstacleCritic", "HumanoidGoalCritic", "HumanoidOscillationCritic"]
      BaseObstacleCritic:
        plugin: "nav2_mppi_controller::ObstacleCritic"
        threshold_to_consider: 0.5
        data_type: "costmap"
        cost_scaling_factor: 1.0
      HumanoidGoalCritic:
        plugin: "nav2_mppi_controller::GoalCritic"
        threshold_to_consider: 0.5
        cost_power: 2
        score_when_at_goal: 0.0
      HumanoidOscillationCritic:
        plugin: "nav2_mppi_controller::OscillationCritic"
        oscillation_speed_threshold: 0.1
```

## Practice
Now let's practice with some exercises to reinforce the concepts learned.

### Exercise 1: Nav2 Configuration for Humanoid Robot
Configure Nav2 for a humanoid robot with specific locomotion constraints. This exercise will demonstrate how to adapt navigation parameters for bipedal systems.

### Exercise 2: Footstep Planning Integration
Integrate footstep planning with Nav2 for stable bipedal navigation. This exercise will show how to connect high-level navigation with low-level stepping.

## Summary
In this chapter, we've explored Nav2 for path planning and navigation specifically adapted for humanoid and bipedal robots. We've covered path planning concepts, the unique challenges of bipedal navigation, and obstacle avoidance strategies. We've also practiced with exercises to reinforce these concepts.

### Key Takeaways
- Nav2 provides sophisticated path planning algorithms adapted for humanoid navigation requirements
- Humanoid navigation requires special consideration for stability and balance constraints
- Obstacle avoidance strategies must prioritize safety and stability for bipedal systems
- Custom plugins and configurations enable Nav2 to handle unique humanoid locomotion patterns