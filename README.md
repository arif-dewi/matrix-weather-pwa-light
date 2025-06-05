# 🌩️ Matrix Weather PWA

A cyberpunk-styled Progressive Web App that displays real-time weather information with stunning Matrix-inspired 3D visualizations.

![Matrix Weather Demo](https://via.placeholder.com/800x400/000000/00ff00?text=MATRIX+WEATHER+DEMO)

## ✨ Features

- **🎭 Matrix-Style 3D Visualization**: Dynamic particle effects that change based on weather conditions
- **📱 Progressive Web App**: Installable, works offline, push notifications
- **🌍 Real-time Weather Data**: Powered by OpenWeatherMap API
- **🎨 Weather-Reactive Animations**: Different effects for rain, snow, storm, sunshine, etc.
- **📍 Location-Aware**: Auto-detect location or manual input
- **⚡ Modern Tech Stack**: TypeScript, React, Three.js, Tailwind CSS
- **🚀 Fast Performance**: Optimized with Vite, code splitting, and caching

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/matrix-weather-pwa.git
cd matrix-weather-pwa
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
VITE_DEFAULT_LATITUDE=25.2048
VITE_DEFAULT_LONGITUDE=55.2708
VITE_DEFAULT_CITY=Dubai
```

4. **Start development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
npm run preview
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **3D Graphics**: Three.js + React Three Fiber
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **PWA**: Vite PWA Plugin + Workbox

### Project Structure
```
src/
├── components/          # React components
│   ├── matrix/         # 3D Matrix visualization
│   ├── weather/        # Weather-related components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── services/           # API services
├── stores/             # Zustand state stores
├── types/              # TypeScript definitions
├── constants/          # App constants
├── config/             # Configuration files
└── utils/              # Helper functions
```

## 🎮 Matrix Effects

The app features different Matrix-style visualizations based on weather conditions:

- **☀️ Sun**: Orbital particle motion with golden colors
- **🌧️ Rain**: Falling blue particles with speed variations
- **❄️ Snow**: Gentle white particles with drift motion
- **💨 Wind**: Horizontal flowing green particles
- **☁️ Clouds**: Dense gray particles with smooth movement
- **⛈️ Storm**: Chaotic red particles with lightning effects
- **🌫️ Fog**: Subtle gray particles with low opacity

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_OPENWEATHER_API_KEY` | OpenWeatherMap API key | Required |
| `VITE_DEFAULT_LATITUDE` | Default latitude | 41.9297 |
| `VITE_DEFAULT_LONGITUDE` | Default longitude | 19.2117 |
| `VITE_DEFAULT_CITY` | Default city name | Ulcinj |

### Customization

#### Adding New Matrix Effects

1. Define effect in `src/constants/matrix.ts`:
```typescript
export const MATRIX_CHARS = {
  yourEffect: ['char1', 'char2', '...'],
  // ...
};

export const WEATHER_VISUAL_SETTINGS = {
  yourEffect: { 
    speedFactor: 1.0, 
    symbolScale: 1.0, 
    countMultiplier: 2.0, 
    color: '#ffffff' 
  },
  // ...
};
```

2. Add animation logic in `src/components/matrix/MatrixParticle.tsx`

3. Map weather conditions in `src/stores/weatherStore.ts`

## 📱 PWA Features

- **Offline Support**: Cached weather data and full app functionality
- **Installable**: Add to home screen on mobile/desktop
- **Background Sync**: Updates weather data when connection is restored
- **Push Notifications**: Weather alerts (future feature)
- **App Shell**: Instant loading with cached shell

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data API
- [Three.js](https://threejs.org/) for 3D graphics
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for React integration
- [The Matrix](https://en.wikipedia.org/wiki/The_Matrix) for visual inspiration

## 🐛 Troubleshooting

### Common Issues

**API Key Not Working**
- Ensure your API key is valid and activated
- Check the API key has the correct permissions
- Verify the key is properly set in `.env.local`

**Location Not Found**
- Enable location services in your browser
- Try entering coordinates manually
- Check your internet connection

**3D Graphics Not Loading**
- Ensure WebGL is supported in your browser
- Update your graphics drivers
- Try disabling browser extensions

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Update dependencies: `npm update`
- Check TypeScript errors: `npm run type-check`

---

Made with ⚡ by [Your Name] | Inspired by the Matrix