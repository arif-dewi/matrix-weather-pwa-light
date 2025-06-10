# Matrix Weather ⚡🌦️

> An immersive weather application featuring Matrix-inspired 3D particle effects that dynamically respond to real-time weather conditions. Built with cutting-edge React architecture, performance optimization, and enterprise-grade patterns.

![CI](https://img.shields.io/github/actions/workflow/status/arif-dewi/matrix-weather-pwa-light/.github%2Fworkflows%2Fmain.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=flat-square&logo=react-query&logoColor=white)](https://tanstack.com/query)
[![Zustand](https://img.shields.io/badge/Zustand-443E38?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## 🎯 Overview

Matrix Weather transforms weather data into an immersive visual experience using dynamic 3D particle systems. Each weather condition triggers unique Matrix-inspired effects - from cascading rain particles to floating snow crystals and storm lightning effects.

### ✨ Key Features

- **🌍 Real-time Weather Intelligence** - OpenWeatherMap API integration with smart caching
- **🎭 Dynamic Matrix Effects** - 8 unique particle systems responding to weather conditions
- **📱 Progressive Web App** - Full offline capabilities with service worker management
- **⚡ Adaptive Performance** - Device-aware rendering optimization (HIGH/MEDIUM/LOW tiers)
- **🎨 Immersive UI** - Matrix-themed interface with cyberpunk aesthetics
- **🔄 Auto-refresh** - Background weather updates with visual indicators
- **📍 Smart Location** - Geolocation and manual city input support
- **🔔 Matrix Notifications** - Themed notification system with visual effects
- **🌐 Connection Status** - Real-time online/offline status monitoring

## 🏗️ Architecture Overview

### Tech Stack
```typescript
Frontend Framework   │ React 18 + TypeScript + Vite
State Management     │ Zustand (Global) + TanStack Query (Server)
3D Graphics          │ Three.js + React Three Fiber
Styling              │ Tailwind CSS + Custom Matrix Theme
Testing              │ Vitest + React Testing Library
PWA                  │ Workbox + Custom Service Worker Manager
Performance          │ Adaptive rendering + Device detection
Date Handling        │ date-fns for time formatting
```

### State Architecture
```
📦 Application State
├── 🌍 Weather Store (Zustand + Persist)
│   ├── Current city & coordinates
│   ├── Matrix effect type mapping
│   ├── Persistent user preferences
│   └── Effect type selectors
├── 🔔 Notification Store (Zustand)
│   ├── Toast notification queue
│   ├── Auto-dismissal timers
│   └── Matrix-themed message types
├── 🌐 Server State (TanStack Query)
│   ├── Weather API cache (5min stale)
│   ├── Location services
│   ├── Automatic retries
│   └── Background refresh intervals
└── 🎮 Component State (React)
    ├── Setup form states
    ├── Animation phases & timing
    └── UI interaction states
```

### Matrix Effect System
```typescript
Weather Condition → Matrix Effect Type → Visual Settings
├── Clear/Sun    → SUN     → Golden particles (#ffdd00), slow float
├── Clouds       → CLOUD   → Gray particles (#aaaaaa), medium drift  
├── Rain         → RAIN    → Blue droplets (#4488ff), fast fall
├── Snow         → SNOW    → White crystals (#ffffff), gentle fall
├── Thunderstorm → STORM   → Red lightning (#ff4444), intense flash
├── Fog/Mist     → FOG     → Sparse gray (#888888), slow drift
├── Wind         → WIND    → Green streams (#88ffaa), fast horizontal
└── Default      → DEFAULT → Classic green matrix (#00ff00)
```

## 🚀 Installation & Setup

### Prerequisites
```bash
Node.js ≥ 18.0.0
npm ≥ 9.0.0
OpenWeatherMap API Key (free tier available)
```

### Quick Start
```bash
# Clone repository
git clone https://github.com/arif-dewi/matrix-weather-pwa-light.git
cd matrix-weather-pwa-light

# Install dependencies
npm install

# Environment setup
cp .env.example .env.local
# Add your OpenWeatherMap API key to .env.local

# Start development server
npm run dev
```

### Environment Variables
```env
# .env.local - Required for full functionality
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here

# Optional configuration
VITE_DEFAULT_CITY="Dubai"
VITE_APP_NAME="Matrix Weather"
VITE_APP_VERSION="2.0.0"
VITE_BASE_WEATHER_URL="https://api.openweathermap.org/data/2.5"
```

### Getting OpenWeatherMap API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate your API key
4. Add it to your `.env.local` file

## 🎮 Usage

### Initial Setup
1. **Auto-initialization** - App detects location automatically on first visit
2. **Manual Setup** - Click the gear button (⚙️) to configure location
3. **Location Options**:
   - 📍 Auto Location - Use device GPS (requires permission)
   - 🌍 Manual - Enter city name (e.g., "London", "Tokyo")

### Weather Display
- **Primary Temperature** - Large display with feels-like comparison
- **Conditions** - Weather description with appropriate matrix effect
- **Details Grid** - Humidity, wind speed/direction, pressure with trends, visibility, temperature range
- **Effect Indicator** - Shows current active matrix effect
- **Refresh Status** - Last update timestamp with auto-refresh indicators

### Matrix Effects in Detail
Each weather condition triggers a unique 3D particle system:

| Weather | Effect | Characters | Behavior | Color |
|---------|---------|------------|----------|-------|
| **Rain** | Cascading droplets | Katakana + water symbols (💧, \|, /, \\) | Fast vertical fall | Blue (#4488ff) |
| **Snow** | Floating crystals | Hiragana + snow symbols (◦, ○, °, ·) | Gentle spiral fall | White (#ffffff) |
| **Sun** | Radiant particles | Numbers + star symbols (☀, ★, ✦, ◉) | Slow floating glow | Gold (#ffdd00) |
| **Storm** | Lightning effects | Mixed + storm symbols (⚡, ☁, 💥, ⛈) | Intense rapid movement | Red (#ff4444) |
| **Clouds** | Drifting masses | Katakana + cloud symbols (▓, ▒, ░, ≡) | Medium horizontal drift | Gray (#aaaaaa) |
| **Wind** | Fast streams | Mixed + wind symbols (~, ≈, →, ↗) | Horizontal streaming | Green (#88ffaa) |
| **Fog** | Sparse mist | Mixed + fog symbols (▒, ░, …, .) | Slow sparse movement | Gray (#888888) |

## 🔧 Development

### Project Structure
```
src/
├── components/           # React component library
│   ├── matrix/          # 3D Matrix visualization system
│   │   ├── MatrixScene.tsx         # Three.js scene setup
│   │   ├── MatrixField.tsx         # Particle field management
│   │   ├── MatrixParticle.tsx      # Individual particle logic
│   │   ├── helper.ts               # Particle utilities
│   │   └── types.ts                # Animation data types
│   ├── weather/         # Weather UI components
│   │   ├── WeatherDisplay.tsx      # Main weather card
│   │   ├── WeatherSetup.tsx        # Configuration panel
│   │   ├── WeatherSetupPanel.tsx   # Setup form UI
│   │   ├── WeatherDetailItem.tsx   # Individual detail display
│   │   ├── LoadingDisplay.tsx      # Loading states
│   │   └── RefreshIndicator.tsx    # Update status
│   ├── notifications/   # Toast notification system
│   │   ├── MatrixNotification.tsx  # Individual notification
│   │   └── MatrixNotificationContainer.tsx
│   ├── status/         # App status indicators
│   │   ├── ConnectionStatusBadge.tsx
│   │   └── helper.ts
│   └── shared/         # Reusable components
│       ├── LoadingFallback.tsx
│       └── ErrorFallback.tsx
├── hooks/               # Custom React hooks
│   ├── useWeather.ts               # Main weather data hook
│   ├── useWeatherMetrics.ts        # Computed weather values
├── stores/             # Zustand state management
│   ├── weatherStore.ts             # Weather data & preferences
│   └── notificationStore.ts        # Notification queue
├── services/           # External service integrations  
│   ├── WeatherService.ts           # OpenWeatherMap API client
│   ├── ServiceWorkerManager.ts     # PWA management
│   └── MatrixLogger.ts             # Structured logging
├── constants/          # Configuration & mappings
│   ├── weather.ts                  # API constants & mappings
│   ├── matrix.ts                   # Visual effect settings
│   └── device.ts                   # Performance thresholds
├── types/             # TypeScript definitions
│   └── weather.ts                  # Weather & effect types
├── utils/             # Utility functions
│   ├── device.ts                   # Device detection
│   └── errorHandling.ts            # Global error management
├── config/            # Environment configuration
│   └── env.ts                      # Environment variable handling
├── providers/         # React context providers
│   └── QueryProvider.tsx           # TanStack Query setup
└── App.tsx            # Main application component
```

### Available Scripts
```bash
npm run dev          # Development server with HMR on http://localhost:5173
npm run build        # Production build with optimizations
npm run preview      # Preview production build locally
npm run lint         # ESLint code analysis with TypeScript rules
npm run type-check   # TypeScript type validation
npm run test         # Run test suite with Vitest
npm run test:ui      # Visual test interface
```

## ⚡ Performance Features

### Adaptive Rendering System
```typescript
Performance Tier Detection:
├── HIGH   - Desktop, 8+ cores     │ 300+ particles, 60 FPS, full effects
├── MEDIUM - Standard devices      │ 200+ particles, 45 FPS, standard effects  
└── LOW    - Limited devices       │ 150+ particles, 30 FPS, minimal effects

Detection Factors:
├── Device Type        │ Mobile vs Desktop detection
├── Hardware Cores     │ navigator.hardwareConcurrency
├── Memory            │ navigator.deviceMemory (when available)
└── Connection        │ navigator.connection.effectiveType
```

### Optimization Techniques
- **Device-Aware Particle Counts** - Dynamic scaling based on performance tier
- **Frame Rate Adaptation** - Update intervals adjust to maintain performance
- **Mobile Optimizations** - Reduced particle counts and simplified effects
- **Memory Management** - Efficient Three.js object disposal and reuse
- **Viewport Culling** - Only animate visible particles
- **Throttled Updates** - Smart update scheduling to prevent frame drops

### Caching Strategy
```typescript
Multi-Layer Caching Architecture:
├── Service Worker Cache    │ API responses, static assets (long-term)
├── TanStack Query Cache   │ 5-minute stale time, background refresh
├── Zustand Persistence    │ User preferences, location data
└── Browser Cache         │ Static assets with appropriate headers
```

## 🌐 PWA Features

### Service Worker Capabilities
- **Offline Weather Display** - Show last cached weather data without connection
- **Background Sync** - Update weather when connection restored
- **App Installation** - Install as native app on desktop and mobile
- **Auto-Updates** - Seamless app updates with user notification prompts
- **Network Status** - Real-time connection status with visual indicators
- **Cache Management** - Intelligent cache cleanup and update strategies

### Installation Process
1. **Browser Prompt** - Automatic PWA install prompt on supported browsers
2. **Manual Installation** - Add to home screen option in browser menu
3. **Native Feel** - Full-screen app experience without browser UI
4. **Offline Access** - Complete functionality without internet connection

## 🎨 Design System

### Matrix Color Palette
```css
Primary Colors:
├── Matrix Green     │ #00ff00  - Main UI elements, classic matrix effect
├── Pure Black      │ #000000  - Background, panels
├── Success Green   │ #22c55e  - Success notifications, online status
├── Warning Yellow  │ #eab308  - Warning states, attention needed
├── Error Red       │ #ef4444  - Error states, offline status
├── Info Blue       │ #3b82f6  - Information messages
└── Weather Effects │ Unique colors per weather condition

Glow Effects:
├── Green Glow      │ rgba(0, 255, 0, 0.4) - Matrix elements
├── Success Glow    │ rgba(34, 197, 94, 0.4) - Success states
├── Warning Glow    │ rgba(234, 179, 8, 0.4) - Warning states
└── Error Glow      │ rgba(239, 68, 68, 0.4) - Error states
```

### Typography System
```css
Font Stack:
├── Primary        │ 'Share Tech Mono' - Futuristic monospace
├── Fallback       │ 'Courier New', monospace
└── System         │ System monospace fonts

Text Effects:
├── Matrix Glow    │ text-shadow: 0 0 10px currentColor
├── Title Glow     │ text-shadow: 0 0 20px currentColor  
└── Subtle Glow    │ text-shadow: 0 0 5px currentColor
```

### Component Design Patterns
- **Matrix Panel** - Black background, glowing green borders, backdrop blur
- **Matrix Button** - Hover states with glow transitions, disabled states
- **Setup Panel** - Collapsible interface with smooth animations
- **Status Badges** - Real-time indicators with appropriate color coding
- **Notification Toast** - Themed messages with auto-dismiss timers

## 🔬 Advanced Features

### Weather Intelligence
- **Smart Auto-Refresh** - Background updates every 10 minutes
- **Stale Data Handling** - 5-minute stale time with background refresh
- **Error Recovery** - Automatic retry with exponential backoff
- **Cache Persistence** - Weather data survives page reloads
- **Location Memory** - Remembers user's preferred location

### Matrix Particle Physics
- **Character Mapping** - Unique symbol sets for each weather type
- **Physics Simulation** - Realistic movement patterns (fall, drift, float)
- **Visual Dynamics** - Speed, scale, and color adapt to weather intensity
- **Performance Scaling** - Particle count adjusts to device capabilities
- **Animation Timing** - Frame-rate independent animations

### Developer Experience
- **Structured Logging** - MatrixLogger with emoji prefixes and grouping
- **Error Boundaries** - Component-level error recovery with themed fallbacks
- **Global Error Handling** - Unhandled promise rejections and errors
- **Development Tools** - TanStack Query DevTools in development
- **Type Safety** - Full TypeScript coverage with strict mode

## 🧪 Testing & Quality

### Testing Framework
```bash
Testing Stack:
├── Vitest           │ Fast unit test runner
├── React Testing    │ Component testing utilities
├── Happy DOM        │ Lightweight DOM implementation
└── Coverage         │ Built-in code coverage reporting
```

### Code Quality Tools
- **TypeScript Strict Mode** - Maximum type safety and error detection
- **ESLint Configuration** - React, TypeScript, and accessibility rules
- **Prettier Integration** - Consistent code formatting across the project
- **Import Sorting** - Organized import statements

### Error Handling Strategy
- **Global Error Handlers** - Catch unhandled errors and promise rejections
- **React Error Boundaries** - Component-level error recovery
- **Service Worker Error Management** - PWA-specific error handling
- **User-Friendly Messages** - Matrix-themed error displays with recovery options

## 📊 Browser Compatibility

### Supported Browsers
```
Minimum Requirements:
├── Chrome/Edge 88+    │ Recommended for best performance
├── Firefox 85+        │ Full feature support
├── Safari 14+         │ WebKit-based features
└── Mobile Browsers    │ iOS Safari 14+, Chrome Mobile 88+

Required APIs:
├── WebGL 1.0          │ Three.js 3D rendering
├── Service Workers    │ PWA functionality  
├── Geolocation API    │ Auto-location features
├── Fetch API          │ Modern HTTP requests
└── ES2020 Features    │ Modern JavaScript syntax
```

### Progressive Enhancement
- **Core Functionality** - Works without advanced features
- **Enhanced Experience** - Additional features with modern API support
- **Graceful Degradation** - Fallbacks for unsupported features

## 🚀 Production Deployment

### Build Optimization
```bash
Production Build Features:
├── Code Splitting      │ Lazy-loaded components for faster initial load
├── Asset Optimization  │ Minified JS/CSS, optimized images
├── Service Worker      │ Automatic caching strategies
├── PWA Manifest       │ App installation metadata
└── Bundle Analysis    │ Performance monitoring tools
```

### Deployment Checklist
1. **Environment Variables** - Ensure API keys are configured
2. **Build Verification** - Test production build locally
3. **Performance Audit** - Lighthouse score optimization
4. **PWA Validation** - Manifest and service worker testing
5. **Error Monitoring** - Production error tracking setup

### Recommended Hosting
- **Vercel** - Optimal for React apps with automatic deployments
- **Netlify** - Great PWA support with edge functions
- **GitHub Pages** - Simple static hosting option
- **Firebase Hosting** - Google's hosting with PWA features

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Process
1. **Fork & Clone** - Create your own fork of the repository
2. **Branch Strategy** - Create feature branches from `main`
3. **Code Standards** - Follow existing TypeScript and React patterns
4. **Testing** - Add tests for new functionality
5. **Documentation** - Update README and code comments
6. **Pull Request** - Submit detailed PR with description

### Contribution Areas
- **🎨 New Matrix Effects** - Additional weather-responsive particle systems
- **⚡ Performance Optimizations** - Further device and rendering improvements
- **🌍 Internationalization** - Multi-language support
- **📱 Mobile Enhancements** - Touch interactions and mobile-specific features
- **🧪 Testing Coverage** - Additional unit and integration tests
- **📖 Documentation** - Code examples, tutorials, and API documentation

### Code Style Guidelines
- Use TypeScript for all new code with proper type definitions
- Follow React best practices with functional components and hooks
- Maintain consistent naming conventions (camelCase for variables, PascalCase for components)
- Add JSDoc comments for complex functions and components
- Ensure responsive design works across all device sizes

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[OpenWeatherMap](https://openweathermap.org/)** - Comprehensive weather data API
- **[Three.js](https://threejs.org/)** - Powerful 3D graphics library
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js
- **[TanStack Query](https://tanstack.com/query)** - Excellent data synchronization
- **[Zustand](https://github.com/pmndrs/zustand)** - Lightweight state management
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Vite](https://vitejs.dev/)** - Fast build tool and development server
- **Matrix Franchise** - Visual inspiration for the cyberpunk aesthetic

---

**🎯 Built with modern React patterns, performance optimization, and enterprise-grade architecture**

*Matrix Weather showcases advanced frontend engineering: real-time data synchronization, 3D graphics programming, Progressive Web App capabilities, adaptive performance optimization, and immersive user experience design.*

## 📈 Project Stats
![GitHub repo size](https://img.shields.io/github/repo-size/arif-dewi/matrix-weather-pwa-light?style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/arif-dewi/matrix-weather-pwa-light?style=flat-square)
![GitHub top language](https://img.shields.io/github/languages/top/arif-dewi/matrix-weather-pwa-light?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/arif-dewi/matrix-weather-pwa-light?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/arif-dewi/matrix-weather-pwa-light?style=flat-square)
![GitHub pull requests](https://img.shields.io/github/issues-pr/arif-dewi/matrix-weather-pwa-light?style=flat-square)