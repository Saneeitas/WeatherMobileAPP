# WeatherMobileAPP

A clean, modern weather mobile application built with React Native and Expo. View real-time weather data and 5-day forecasts for any location worldwide, powered by the OpenWeatherMap API.

## Features

- **Current Weather** - Real-time temperature, humidity, wind speed, pressure, and more
- **5-Day Forecast** - Daily and hourly weather predictions with min/max temperatures
- **Location Search** - Search and save your favorite cities for quick access
- **Auto Location** - Detects your current location for local weather
- **Temperature Units** - Toggle between Celsius and Fahrenheit
- **Dynamic UI** - Background gradients adapt to weather conditions and time of day
- **Offline-Ready Architecture** - Cached weather data with smart refresh intervals
- **Pull to Refresh** - Swipe down to update weather data instantly

## Tech Stack

| Technology | Purpose |
|---|---|
| React Native | Cross-platform mobile framework |
| Expo SDK 52 | Managed workflow, build tooling |
| TypeScript | Type safety and developer experience |
| React Navigation | Tab-based navigation |
| React Context + useReducer | State management |
| AsyncStorage | Local data persistence |
| OpenWeatherMap API | Weather data source |
| Expo Location | Device geolocation |
| Expo Linear Gradient | Dynamic background effects |

## Architecture Overview

```
App.tsx (Entry Point)
|
+-- Providers (SafeAreaProvider > WeatherProvider > LocationProvider)
    |
    +-- AppNavigator (Bottom Tab Navigation)
        |
        +-- HomeScreen         (Current weather + hourly forecast)
        +-- ForecastScreen     (5-day forecast details)
        +-- LocationsScreen    (Search + saved locations)
        +-- SettingsScreen     (Unit toggle + app info)
```

**Data Flow:**

```
User Action --> Hook (useWeather/useLocation)
                  |
                  v
            Context Provider (dispatch action)
                  |
                  v
            Reducer (update state)
                  |
                  v
            Service Layer (WeatherService / LocationService)
                  |
                  v
            OpenWeatherMap API
```

## Project Structure

```
WeatherMobileAPP/
+-- App.tsx                     # Application entry point
+-- app.json                    # Expo configuration
+-- package.json                # Dependencies and scripts
+-- tsconfig.json               # TypeScript configuration
+-- babel.config.js             # Babel with path alias support
+-- metro.config.js             # Metro bundler configuration
+-- .eslintrc.js                # ESLint rules
+-- .env.example                # Environment variable template
+-- assets/                     # Images, fonts, and static files
+-- src/
    +-- components/             # Reusable UI components
    |   +-- DailyForecastItem.tsx
    |   +-- ErrorMessage.tsx
    |   +-- Header.tsx
    |   +-- HourlyForecastItem.tsx
    |   +-- LoadingSpinner.tsx
    |   +-- LocationCard.tsx
    |   +-- SearchBar.tsx
    |   +-- TemperatureDisplay.tsx
    |   +-- WeatherCard.tsx
    |   +-- WeatherDetails.tsx
    |   +-- WeatherIcon.tsx
    |   +-- index.ts            # Barrel exports
    +-- screens/                # Screen-level components
    |   +-- HomeScreen.tsx
    |   +-- ForecastScreen.tsx
    |   +-- LocationsScreen.tsx
    |   +-- SettingsScreen.tsx
    |   +-- index.ts
    +-- context/                # React Context state management
    |   +-- WeatherContext.tsx
    |   +-- LocationContext.tsx
    +-- hooks/                  # Custom React hooks
    |   +-- useWeather.ts
    |   +-- useLocation.ts
    |   +-- index.ts
    +-- services/               # API and device service layer
    |   +-- weatherApi.ts
    |   +-- locationService.ts
    |   +-- index.ts
    +-- types/                  # TypeScript type definitions
    |   +-- weather.ts
    |   +-- index.ts
    +-- constants/              # App configuration and constants
    |   +-- colors.ts
    |   +-- config.ts
    |   +-- weatherIcons.ts
    |   +-- index.ts
    +-- utils/                  # Utility/helper functions
        +-- helpers.ts
        +-- index.ts
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (installed globally or via npx)
- [Expo Go](https://expo.dev/client) app on your phone (for testing on device)
- An [OpenWeatherMap API key](https://openweathermap.org/appid) (free tier available)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/WeatherMobileAPP.git
   cd WeatherMobileAPP
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Open `.env` and replace the placeholder with your actual API key:

   ```
   EXPO_PUBLIC_WEATHER_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server:**

   ```bash
   npx expo start
   ```

5. **Run on your device or emulator:**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## API Setup

This app uses the [OpenWeatherMap API](https://openweathermap.org/) for weather data.

### Getting Your API Key

1. Create a free account at [openweathermap.org](https://openweathermap.org/appid)
2. Navigate to "API keys" in your account dashboard
3. Copy your default API key or generate a new one
4. The free tier includes:
   - 60 calls/minute
   - Current weather data
   - 5-day/3-hour forecast
   - Geocoding API

### API Endpoints Used

| Endpoint | Purpose |
|---|---|
| `/data/2.5/weather` | Current weather by coordinates |
| `/data/2.5/forecast` | 5-day/3-hour forecast |
| `/geo/1.0/direct` | City name geocoding (search) |

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `EXPO_PUBLIC_WEATHER_API_KEY` | Yes | Your OpenWeatherMap API key |

All environment variables prefixed with `EXPO_PUBLIC_` are accessible in the app at runtime via `process.env`. Never commit your `.env` file to version control.

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo development server |
| `npm run android` | Start on Android emulator |
| `npm run ios` | Start on iOS simulator |
| `npm run web` | Start in web browser |
| `npm test` | Run Jest test suite |
| `npm run lint` | Run ESLint checks |

## Security

- API keys are stored in environment variables, never hardcoded
- User input in search queries is sanitized to prevent injection
- No user authentication required (read-only weather data)
- Network requests use timeout and abort controllers
- AsyncStorage is used for local persistence only (saved locations, preferences)

## Screenshots

> Screenshots will be added after the first production build.

| Home Screen | Forecast | Locations | Settings |
|---|---|---|---|
| *Current weather with hourly forecast* | *5-day daily forecast* | *Search and saved cities* | *Unit toggle and app info* |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and ensure lint passes: `npm run lint`
4. Run tests: `npm test`
5. Commit with a descriptive message: `git commit -m "feat: add my feature"`
6. Push to your fork: `git push origin feature/my-feature`
7. Open a Pull Request against `main`

### Code Style

- TypeScript strict mode enabled
- Functional components with hooks (no class components)
- Named exports preferred over default exports
- Path aliases: `@/` maps to `src/`
- StyleSheet.create for all component styles

## License

This project is for educational and personal use.
