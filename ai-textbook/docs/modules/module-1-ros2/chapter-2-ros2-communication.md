---
title: "Chapter 2 - ROS 2 Communication"
description: "Understanding ROS 2 communication patterns: Nodes, Topics, Services, Actions"
tags: ["ROS2", "textbook", "education", "communication"]
learning_objectives:
  - "Understand ROS 2 communication patterns: Nodes, Topics, Services, Actions"
  - "Learn about message passing and modular design"
  - "Practice implementing different communication patterns"
summary: "This chapter explores ROS 2 communication patterns including Nodes, Topics, Services, and Actions, with emphasis on modular design."
---

# Chapter 2 - ROS 2 Communication

## Learning Objectives
- Understand ROS 2 communication patterns: Nodes, Topics, Services, Actions
- Learn about message passing and modular design
- Practice implementing different communication patterns

## Concept
ROS 2 communication is based on a distributed system architecture where different processes (nodes) communicate with each other using several patterns. These patterns enable modular design and flexible system architectures.

### Communication Patterns Overview
- **Nodes**: Basic execution units that perform computation
- **Topics**: Asynchronous publish/subscribe communication
- **Services**: Synchronous request/response communication
- **Actions**: Asynchronous goal-oriented communication with feedback

### Topics and Publishers/Subscribers
Topics use a publish/subscribe pattern for one-to-many communication. Publishers send messages to a topic, and subscribers receive messages from the topic. This pattern is asynchronous and allows for decoupled communication.

### Services and Clients
Services use a request/response pattern for synchronous communication. A client sends a request to a service and waits for a response. This pattern is synchronous and blocks until the response is received.

### Actions
Actions are used for long-running tasks that require feedback and the ability to cancel. They follow a goal-feedback-result pattern.

## System
Let's look at how these communication patterns are implemented in practice using rclpy:

### Topic Publisher Example
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher = self.create_publisher(String, 'topic', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello World: %d' % self.i
        self.publisher.publish(msg)
        self.get_logger().info('Publishing: "%s"' % msg.data)
        self.i += 1
```

### Service Implementation
```python
from example_interfaces.srv import AddTwoInts
import rclpy
from rclpy.node import Node

class MinimalService(Node):
    def __init__(self):
        super().__init__('minimal_service')
        self.srv = self.create_service(AddTwoInts, 'add_two_ints', self.add_two_ints_callback)

    def add_two_ints_callback(self, request, response):
        response.sum = request.a + request.b
        self.get_logger().info('Incoming request\na: %d b: %d' % (request.a, request.b))
        return response
```

## Practice
Now let's practice implementing different communication patterns.

### Exercise 1: Publisher and Subscriber
Create a publisher node that sends temperature data and a subscriber node that receives and processes this data.

### Exercise 2: Service Server and Client
Implement a service that calculates the distance between two points and a client that calls this service.

### Exercise 3: Action Server and Client
Create an action that simulates moving a robot to a goal position with feedback on progress.

## Summary
In this chapter, we've explored ROS 2 communication patterns including Nodes, Topics, Services, and Actions. We've seen how these patterns enable modular design and flexible system architectures. Through practical examples and exercises, we've learned how to implement these communication patterns in ROS 2 systems.