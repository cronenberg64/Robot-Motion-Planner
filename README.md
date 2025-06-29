# Robot Movement Sequence Planner Bot

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![ROS2](https://img.shields.io/badge/ROS2-Humble-blue)](https://docs.ros.org/en/humble/)
[![MoveIt2](https://img.shields.io/badge/MoveIt2-2.0-green)](https://moveit.ros.org/)

An AI-powered motion sequence planner that transforms natural language descriptions into precise robot arm trajectories, generating ROS2-compatible `trajectory_msgs/JointTrajectory` messages for seamless integration with MoveIt2.

## Features

- **Natural Language Processing**: Describe robot actions in plain English
- **MoveIt2 Integration**: Generate compatible trajectory messages for ROS2
- **Real-time Visualization**: Interactive 3D pose visualization
- **Export Capabilities**: YAML and JSON export formats
- **Customizable Sequences**: Complex multi-step motion sequences
- **Real-time Processing**: Instant trajectory generation
- **Modern UI**: Clean, responsive interface

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Three.js
- **Backend**: Firebase Studio, OpenAI GPT-4, LangChain
- **Robotics**: ROS2 Humble, MoveIt2, trajectory_msgs

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.8+
- ROS2 Humble
- MoveIt2

### Frontend Setup
```bash
git clone https://github.com/yourusername/robot-motion-planner.git
cd robot-motion-planner
npm install
cp .env.example .env.local
npm run dev
```

### Backend Setup
```bash
pip install -r requirements.txt
firebase login
firebase init
firebase deploy
```

### ROS2 Integration
```bash
# Install ROS2 Humble and MoveIt2
sudo apt install ros-humble-moveit
# Configure your robot's URDF/XACRO files
```

## Usage

1. **Open the web interface** at `http://localhost:3000`
2. **Describe your robot action** using natural language:
   ```
   "Make the robot wave its arm, then point to the left, and finally return to rest position"
   ```
3. **Review the generated trajectory** in the 3D visualization
4. **Export the trajectory** in YAML or JSON format

### Example Prompts
- "Wave hello" → 3-point trajectory with arm rotation
- "Pick up object from table" → 5-point trajectory with approach, grasp, and retreat
- "Dance sequence" → Complex multi-step trajectory

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation for new features
- Ensure ROS2 compatibility

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- **[ROS](https://www.ros.org/)** - Robot Operating System foundation
- **[MoveIt](https://moveit.ros.org/)** - Motion planning framework
- **[OpenAI](https://openai.com/)** - GPT-4 API for natural language processing
- **[Firebase](https://firebase.google.com/)** - Backend infrastructure
- **[Next.js](https://nextjs.org/)** - React framework
- **[Three.js](https://threejs.org/)** - 3D graphics library

