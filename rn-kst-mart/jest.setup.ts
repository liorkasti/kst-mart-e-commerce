import '@testing-library/jest-native/extend-expect';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Mock expo-image to a simple View so it renders in tests
jest.mock('expo-image', () => {
  const React = require('react');
  return {
    Image: (props: any) => React.createElement('View', props),
  };
});
