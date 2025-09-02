# KST - Products Mart Demo Project

A demo React Native application built with Expo, listing products and categories.

## Project layout
- `rn-kst-mart/` — Expo (React Native, TypeScript) app
- `shared/` — Shared static data (e.g., `products.json`) used by the RN app
- `next-kst-mart/`, `packages/` — Web and packages (not required to run RN app)

## Features
- Categories overview built from a local JSON dataset (`shared/products.json`).
- For each category: thumbnail, product count, and total stock.
- Category details modal with product list, image, price, and stock.
- Clean, typed components with Themed UI and small animations.

## Requirements
- Node 18+
- Expo CLI (use the versioned local CLI via npx)
- iOS Simulator or Android Emulator, or a physical device with Expo Go

## Install & Run (React Native app)
```bash
# clone repo
git clone https://github.com/liorkasti/kst-mart-e-commerce.git
cd kst-mart-e-commerce/rn-kst-mart

# install dependencies (choose one)
npm install
# or
yarn install
# or
bun install

# start dev server (use the versioned local CLI)
npx expo start -c
```

## Scripts (quick reference)
Run from `rn-kst-mart/`:
```bash
npx expo start -c        # start dev with cache clear
npx expo run:ios         # iOS simulator (requires Xcode)
npx expo run:android     # Android emulator (requires Android Studio)
```

## Roadmap / TODO
- Cart: Add to cart and cart UI (Redux Toolkit slice in RN app)
- Category details: filters and sorting
- Error states and skeleton placeholders
- Accessibility polish (roles, labels, focus order)
- Micro-animations for transitions
- Tests: category aggregation and CategoryCard
