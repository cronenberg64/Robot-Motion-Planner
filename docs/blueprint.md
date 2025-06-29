# **App Name**: Robot Motion Planner

## Core Features:

- Prompt Input: Input box for entering natural language motion prompts (e.g., 'Make the robot wave, then point, then rest.')
- Motion Parsing: Use GPT-4 as a tool to analyze the natural language prompt and output a structured list of motion primitives (e.g., wave, point, rest).
- Motion Step Display: Display parsed motion steps below the input box, with placeholders for robot joint names and angles.
- Motion Template Mapping: Map each motion primitive to a predefined template of joint angles.
- Trajectory Generation Button: Display of 'Submit' button which simulates trajectory generation.
- Interactive Motion Step Editor: UI elements such as clickable motion steps for angle edits.
- Export Motion Plan: Functionality to export motion plan as either a ROS-compatible .yaml or .json file.

## Style Guidelines:

- Primary color: Soft blue (#64B5F6) to evoke a sense of technology and precision.
- Background color: Light gray (#F0F0F0), almost white, providing a clean, unobtrusive backdrop.
- Accent color: Teal (#26A69A), to highlight interactive elements and call attention to important details.
- Body and headline font: 'Inter', a grotesque-style sans-serif font known for its modern, machined look and suitability for both headlines and body text.
- Use simple, geometric icons to represent robot joints and movements.
- A clean, grid-based layout will ensure easy navigation and a professional look.
- Subtle animations, such as smooth transitions between motion steps, to enhance the user experience.