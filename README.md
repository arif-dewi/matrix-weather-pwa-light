# Matrix Weather ⚡🌦️

> An immersive weather application featuring Matrix-inspired 3D particle effects that dynamically respond to real-time weather conditions. Built with cutting-edge React architecture, performance optimization, and enterprise-grade patterns.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query)
[![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

## 🎯 Overview

Matrix Weather transforms weather data into an immersive visual experience using dynamic 3D particle systems. Each weather condition triggers unique Matrix-inspired effects - from cascading rain particles to floating snow crystals and storm lightning effects.

### ✨ Key Features

- **🌍 Real-time Weather Intelligence** - OpenWeatherMap API integration with smart caching
- **🎭 Dynamic Matrix Effects** - 7 unique particle systems responding to weather conditions
- **📱 Progressive Web App** - Full offline capabilities with service worker
- **⚡ Adaptive Performance** - Device-aware rendering optimization (HIGH/MEDIUM/LOW tiers)
- **🎨 Immersive UI** - Matrix-themed interface with cyberpunk aesthetics
- **🔄 Auto-refresh** - Configurable background weather updates
- **📍 Smart Location** - Geolocation and manual city input support
- **🔔 Matrix Notifications** - Themed notification system with visual effects

## 🏗️ Architecture Overview

### Tech Stack
```typescript
Frontend Framework     │ React 18 + TypeScript
State Management      │ Zustand (Global) + TanStack Query (Server)
3D Graphics          │ Three.js + React Three Fiber
Styling              │ Tailwind CSS + Custom Matrix Theme
Build Tool           │ Vite
PWA                  │ Workbox + Custom Service Worker
Performance          │ Adaptive rendering + Memory pooling
```

### State Architecture
```
📦 Application State
├── 🌍 Weather Store (Zustand)
│   ├── Weather data & location
│   ├── Matrix effect type
│   ├── User preferences
│   └── Cache management
├── 🔔 Notification Store (Zustand)
│   └── Toast notification system
├── 🌐 Server State (TanStack Query)
│   ├── Weather API cache
│   ├── Location services
│   └── Background refresh
└── 🎮 Component State (React)
    ├── Setup form states
    ├── Animation phases
    └── UI interactions
```

### Matrix Effect System
```typescript
Weather Condition → Matrix Effect Type → Visual Settings
├── Clear/Sun    → SUN     → Golden particles, slow float
├── Clouds       → CLOUD   → Gray particles, medium drift
├── Rain         → RAIN    → Blue droplets, fast fall
├── Snow         → SNOW    → White crystals, gentle fall
├── Thunderstorm → STORM   → Red lightning, intense flash
├── Fog/Mist     → FOG     → Sparse gray, slow drift
├── Wind         → WIND    → Green streams, fast horizontal
└── Default      → DEFAULT → Classic green matrix rain
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
git clone <repository-url>
cd matrix-weather

# Install dependencies
npm install

# Environment setup
cp .env.example .env.local
# Add your OpenWeatherMap API key to .env.local

# Start development
npm run dev
```

### Environment Variables
```env
# .env.local - Required for full functionality
VITE_OPENWEATHER_API_KEY=your_openweather_api_key

# Optional - Default location (Dubai)
VITE_DEFAULT_LATITUDE=25.276987
VITE_DEFAULT_LONGITUDE=55.296249
VITE_DEFAULT_CITY=Dubai

# App metadata
VITE_APP_NAME="Matrix Weather"
VITE_APP_VERSION="2.0.0"
```

## 🎮 Usage

### Initial Setup
1. **Auto-initialization** - If API key and location are configured, app starts automatically
2. **Manual Setup** - Click the gear button (⚙️) to configure location
3. **Location Options**:
    - 📍 Auto Location - Use device GPS
    - 🌍 Manual - Enter city name or coordinates

### Weather Display
- **Temperature** - Large display with feels-like comparison
- **Conditions** - Weather description with appropriate matrix effect
- **Details Grid** - Humidity, wind, pressure, visibility, temperature range
- **Effect Type** - Current matrix effect being displayed
- **Refresh Status** - Last update time and refresh indicator

### Matrix Effects
Each weather condition triggers a unique particle system:
- **Rain** - Blue cascading droplets with katakana characters
- **Snow** - White floating crystals with gentle fall
- **Sun** - Golden particles with star symbols
- **Storm** - Red intense particles with lightning symbols
- **Clouds** - Gray drifting particles
- **Wind** - Fast-moving green streams
- **Fog** - Sparse, slow-moving gray particles

## 🔧 Development

### Project Structure
```
src/
├── components/           # React components
│   ├── matrix/          # 3D Matrix visualization
│   │   ├── MatrixScene.tsx
│   │   ├── MatrixField.tsx
│   │   └── MatrixParticle.tsx
│   ├── weather/         # Weather UI components
│   │   ├── WeatherDisplay.tsx
│   │   ├── WeatherSetup.tsx
│   │   └── WeatherDetailItem.tsx
│   ├── notifications/   # Toast notification system
│   ├── status/         # Connection status
│   └── shared/         # Reusable components
├── hooks/               # Custom React hooks
│   ├── useWeatherSetup*.ts
│   ├── useWeatherDisplay*.ts
│   └── usePerformanceOptimization.ts
├── stores/             # Zustand state stores
│   ├── weatherStore.ts
│   └── notificationStore.ts
├── services/           # External service integrations
│   ├── WeatherService.ts
│   ├── WeatherQueryService.ts
│   ├── ServiceWorkerManager.ts
│   └── MatrixLogger.ts
├── constants/          # Configuration constants
│   ├── weather.ts
│   ├── matrix.ts
│   └── device.ts
├── types/             # TypeScript type definitions
│   └── weather.ts
└── utils/             # Utility functions
    ├── device.ts
    ├── performance.ts
    └── errorHandling.ts
```

### Available Scripts
```bash
npm run dev          # Development server with HMR
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint code analysis
npm run lint:fix     # Auto-fix ESLint issues
npm run type-check   # TypeScript type validation
npm run format       # Prettier code formatting
```

## ⚡ Performance Features

### Adaptive Rendering System
```typescript
Performance Tiers:
├── HIGH   - Desktop, 8+ cores  │ 150 particles, 60 FPS, all effects
├── MEDIUM - Mobile/Tablet      │ 100 particles, 45 FPS, reduced effects
└── LOW    - Limited devices    │ 75 particles, 30 FPS, minimal effects
```

### Optimization Techniques
- **Dynamic Performance Monitoring** - Real-time FPS tracking with tier adjustment
- **Particle Pooling** - Efficient memory management for 3D objects
- **Frustum Culling** - Only render visible particles
- **Update Throttling** - Frame-rate based update intervals
- **Mobile Optimization** - Reduced particle count and effects on mobile devices

### Caching Strategy
```typescript
Multi-layer Caching:
├── Browser Cache    │ Static assets, long-term storage
├── Service Worker   │ API responses, offline support
├── TanStack Query   │ 5-minute stale time, background refresh
└── Zustand Persist  │ User preferences, last location
```

## 🌐 PWA Features

### Service Worker Capabilities
- **Offline Weather Display** - Show cached weather data when offline
- **Background Sync** - Update weather data when connection restored
- **App Installation** - Install as native app on desktop/mobile
- **Auto-updates** - Seamless app updates with user notification
- **Network Status** - Visual connection status indicator

### Offline Functionality
- Display last cached weather data
- Full matrix effect functionality
- Settings and preferences access
- Installation and update management

## 🎨 Design System

### Matrix Theme
```css
Color Palette:
├── Primary Green    │ #00ff00 (matrix green)
├── Background      │ #000000 (pure black)
├── Glow Effects    │ rgba(0, 255, 0, 0.4)
├── Success         │ #22c55e
├── Warning         │ #eab308
├── Error           │ #ef4444
└── Info            │ #3b82f6

Typography:
├── Primary Font    │ 'Share Tech Mono'
├── Fallback        │ 'Courier New', monospace
└── Text Effects    │ Glow shadows, cyberpunk styling
```

### Component Patterns
- **Matrix Panel** - Glowing borders with backdrop blur
- **Matrix Button** - Hover effects with glow animations
- **Setup Panel** - Collapsible configuration interface
- **Status Indicators** - Real-time connection and update status

## 🔬 Advanced Features

### Weather Intelligence
- **Auto-refresh** - Configurable interval (default: 10 minutes)
- **Stale Data Detection** - Smart cache invalidation
- **Error Recovery** - Automatic retry with exponential backoff
- **Location Persistence** - Remember user's preferred location

### Matrix Particle System
- **Character Sets** - Unique symbols for each weather type
- **Animation Patterns** - Weather-appropriate movement (fall, float, drift)
- **Visual Settings** - Dynamic colors, sizes, and speeds
- **Performance Scaling** - Adaptive particle count and effects

### Developer Experience
- **Comprehensive Logging** - Structured logging with MatrixLogger
- **Error Boundaries** - Graceful error handling and recovery
- **Debug Tools** - Development console utilities
- **Performance Monitoring** - Built-in performance metrics

## 🧪 Testing & Quality

### Code Quality Tools
- **TypeScript** - Full type safety with strict mode
- **ESLint** - React, TypeScript, and accessibility rules
- **Prettier** - Consistent code formatting

### Error Handling
- **Global Error Handlers** - Catch unhandled errors and rejections
- **React Error Boundaries** - Component-level error recovery
- **Service Worker Error Handling** - PWA error management
- **User-friendly Error Messages** - Matrix-themed error displays

## 📊 Browser Support

### Modern Browsers
- Chrome/Edge 88+ (recommended)
- Firefox 85+
- Safari 14+
- Mobile browsers with WebGL support

### Feature Detection
- WebGL support required for 3D effects
- Service Worker support for PWA features
- Geolocation API for auto-location
- Background sync for offline updates

## 🚀 Deployment

### Build Process
```bash
# Create optimized production build
npm run build

# Output includes:
├── Minified JavaScript bundles
├── Optimized CSS with Tailwind purging
├── Service worker with caching strategies
├── PWA manifest for app installation
└── Compressed assets
```

### Environment Configuration
- **Development** - Hot reload, debug logging, dev tools
- **Production** - Optimized bundles, service worker, error tracking

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Follow TypeScript and React best practices
4. Add tests for new functionality
5. Update documentation
6. Submit a pull request

### Development Guidelines
- Use TypeScript for all new code
- Follow existing component patterns
- Maintain performance optimization principles
- Add appropriate error handling
- Update relevant documentation

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenWeatherMap** - Comprehensive weather data API
- **Three.js Community** - Powerful 3D graphics capabilities
- **React Team** - Modern frontend framework
- **TanStack** - Excellent developer tools ecosystem
- **Matrix Franchise** - Visual inspiration for the cyberpunk aesthetic

---

**🎯 Built with modern React patterns, performance optimization, and enterprise-grade architecture**

*Showcasing advanced frontend engineering: real-time data synchronization, 3D graphics, PWA capabilities, and adaptive performance optimization.*