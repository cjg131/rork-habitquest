# Stride

A comprehensive habit tracking and productivity app built with React Native and Expo. Stride combines habit tracking, task management, Pomodoro timer, and gamification elements to help users build better habits and stay productive.

## Features

### 🎯 Core Functionality
- **Habit Tracking**: Create and track daily, weekly, or custom frequency habits
- **Task Management**: Organize tasks with priorities, due dates, and completion tracking
- **Pomodoro Timer**: Focus sessions with customizable work and break intervals
- **Calendar Integration**: View tasks and habits in a calendar format
- **Gamification**: Earn XP, level up, and track streaks

### 📱 User Experience
- **Cross-Platform**: Works on iOS, Android, and Web
- **Intuitive Interface**: Clean, modern design with smooth animations
- **Customizable**: Personalize colors, reminders, and tracking preferences
- **Offline Support**: Works without internet connection

### 💎 Premium Features
- **Ad-Free Experience**: Remove all advertisements
- **Data Export**: Export your data for backup or analysis
- **Advanced Analytics**: Detailed insights into your habits and productivity
- **Custom Themes**: Additional color schemes and customization options

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: Zustand + React Query
- **Backend**: Hono + tRPC
- **Database**: Local storage with AsyncStorage
- **UI Components**: Custom components with Lucide icons
- **Styling**: React Native StyleSheet

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Bun package manager
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rork-stride.git
cd rork-stride
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run start
```

4. For web development:
```bash
bun run start-web
```

### Running on Device

1. Install the Expo Go app on your mobile device
2. Scan the QR code displayed in the terminal
3. The app will load on your device

## Project Structure

```
├── app/                    # App screens and navigation
│   ├── (auth)/            # Authentication screens
│   ├── (onboarding)/      # Onboarding flow
│   ├── (tabs)/            # Main tab navigation
│   └── modal.tsx          # Modal screens
├── backend/               # Backend API with tRPC
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI components
│   ├── auth/             # Authentication components
│   ├── habits/           # Habit-related components
│   ├── tasks/            # Task-related components
│   └── dashboard/        # Dashboard components
├── hooks/                 # Custom React hooks
├── constants/             # App constants and configuration
├── types/                 # TypeScript type definitions
└── assets/               # Images and static assets
```

## Key Features Implementation

### Habit Tracking
- Create habits with custom frequencies (daily, weekly, custom)
- Track completion with streak counting
- Visual progress indicators
- Reminder notifications

### Task Management
- Priority levels (low, medium, high) with color coding
- Due date tracking with calendar integration
- Subtask support
- Completion states with user-configurable behavior

### Gamification
- XP system with level progression
- Achievement badges
- Streak tracking
- Progress visualization

### Data Management
- Local storage with AsyncStorage
- Data export functionality (Premium)
- Backup and restore capabilities

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful component and variable names
- Write tests for new features
- Follow the existing code style
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/rork-stride/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about the issue

## Roadmap

- [ ] Social features and habit sharing
- [ ] Advanced analytics and insights
- [ ] Integration with health apps
- [ ] Team challenges and competitions
- [ ] AI-powered habit recommendations
- [ ] Widget support for home screen

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons by [Lucide](https://lucide.dev/)
- Inspired by popular productivity and habit tracking apps

---

**Stride** - Transform your habits, transform your life! 🚀