# Hermes Hub

Hermes Hub is a consumer marketplace MVP for finding trusted local businesses, skilled professionals, creators, makers, and service providers in Ibadan, Nigeria.

Product promise: **Whatever you need, find it nearby.**

## Tech Stack

- Expo
- React Native
- TypeScript
- Expo Router
- Local mock data and mock marketplace services

## Run The App

```bash
npm install
npx expo start
```

Then open the app in Expo Go, an iOS simulator, Android emulator, or the Expo web preview.

## MVP Scope

This frontend uses mock data only. It does not include:

- Backend integration
- Real payments
- Real maps
- Real authentication

The data and async mock service methods live in `src/data` and `src/services` so a NestJS backend can later replace the local implementations without rewriting the UI screens.

## Included Screens

- Onboarding
- Signup and login
- Home
- Search
- Category list
- Nearby businesses
- Business profile
- Product/service details
- Booking request cart
- Checkout
- Wallet
- Order tracking
- Delivery status
- Reviews and ratings
- Profile/settings
