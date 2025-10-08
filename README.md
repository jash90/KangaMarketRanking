# Kanga Market Ranking 📊

React Native application for cryptocurrency market liquidity analysis on Kanga Exchange.

## 📋 Requirements

Before running, make sure you have installed:

- **Node.js** v18.0.0 or newer
- **pnpm** v8.0.0 or newer (alternatively npm or yarn)
- **Expo CLI** (will be installed automatically)

### For iOS (macOS only):
- **Xcode** 15.0 or newer
- **iOS Simulator**

### For Android:
- **Android Studio**
- **Android SDK** (API Level 31+)
- **Android Emulator** or physical device

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd KangaMarketRanking
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment

```bash
# Copy configuration file
cp .env.example .env

# Edit .env file and set appropriate values (if required)
```

### 4. Run the application

#### Option A: Run on any platform (recommended)

```bash
pnpm start
```

After starting, you'll see a menu in the terminal:
- Press `i` - to open in iOS simulator
- Press `a` - to open in Android emulator
- Press `w` - to open in web browser
- Scan the QR code with Expo Go app on your phone

#### Option B: Run on specific platform

```bash
# iOS
pnpm run ios

# Android
pnpm run android

# Web
pnpm run web
```

## 📱 Testing on Physical Device

1. Install **Expo Go** app on your phone:
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Run the project: `pnpm start`

3. Scan the QR code displayed in the terminal or browser

4. Make sure your phone and computer are on the same WiFi network

## 🛠️ Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm start` | Starts development server |
| `pnpm run ios` | Runs on iOS |
| `pnpm run android` | Runs on Android |
| `pnpm run web` | Runs in browser |
| `pnpm test` | Runs tests |
| `pnpm run lint` | Checks code |
| `pnpm run format` | Formats code |

## ✨ Main Features

- **Market Liquidity Analysis** - RAG (Red-Amber-Green) system for liquidity assessment
- **Real-time Data** - Live price and volume updates from Kanga Exchange
- **Spread Calculation** - Accurate bid-ask spread calculation
- **Search and Sort** - Quick search for interesting currency pairs
- **Responsive Design** - Works on iOS, Android, and web browser

## 🔧 Troubleshooting

### Problem: Metro bundler not working

```bash
# Clear cache
npx expo start -c
```

### Problem: iOS build error

```bash
cd ios && pod install && cd ..
pnpm run ios
```

### Problem: Android build error

```bash
cd android && ./gradlew clean && cd ..
pnpm run android
```

### Problem: Expo Go can't connect to server

1. Check if phone and computer are on the same WiFi network
2. Try connecting through tunnel:
   ```bash
   npx expo start --tunnel
   ```

### Problem: Port 8081 is busy

```bash
# Find and terminate process using the port
lsof -i :8081
kill -9 <PID>

# Or run on different port
npx expo start --port 8082
```

## 📁 Project Structure

```
KangaMarketRanking/
├── app/              # Application screens (Expo Router)
├── components/       # React components
├── api/             # API integration
├── hooks/           # Custom React Hooks
├── utils/           # Helper functions
├── config/          # Configuration
├── assets/          # Images, fonts
└── __tests__/       # Tests
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Tests in watch mode
pnpm run test:watch

# Code coverage report
pnpm run test:coverage
```

## 📦 Technologies

- **React Native** 0.81.4 - Mobile framework
- **Expo** 54 - Development platform
- **TypeScript** 5.9 - Static typing
- **Axios** - HTTP client
- **Zod** - Data validation
- **Jest** - Unit testing

## 📄 License

MIT

## 👨‍💻 Contact

For questions or issues, please create an issue in the repository.

---

**Note:** Before the first run, make sure you have all required tools installed. You can find detailed installation instructions in the [React Native](https://reactnative.dev/docs/environment-setup) and [Expo](https://docs.expo.dev/get-started/installation/) documentation.