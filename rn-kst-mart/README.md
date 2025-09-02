# KST Mart

A demo React Native application built with **Expo**, listing products.

## Features
- Fetches product data from [dummyjson API](https://dummyjson.com/products?limit=100).
- Categories overview screen:
  - Unique categories with thumbnail, product count, and stock sum.
- Category details screen:
  - List of products with image, price, and stock.

## TODOS
- Category details screen:
    - Add to cart functionality.
    - Filter
    - Sorting capability
- **Redux Toolkit** extended feature  for cart state management: chore(infra): add navigation, react-query, redux-toolkit setup.
- **React Query** for data fetching, caching, and offline persistence.
- Error handling, loading states, and skeleton placeholders.
- Accessibility-friendly components.
- Light micro-animations for better UX.
- **Testing** test: add unit tests for category aggregations and category card

## Tech Stack
- [Expo](https://expo.dev/) (React Native, TypeScript)
- [React Query](https://tanstack.com/query) – API data & caching
- [Redux Toolkit](https://redux-toolkit.js.org/) – Cart management
- [React Navigation](https://reactnavigation.org/) – Navigation
- [Jest](https://jestjs.io/) – Basic unit tests

## Installation
```bash
# clone repo
git clone https://github.com/your-username/kst-cart-hacker.git
cd cd rn-kst-mart 

# install dependencies
yarn install

# start project
yarn start

