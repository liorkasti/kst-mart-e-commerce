import { useMemo, useRef } from 'react';
import { Animated } from 'react-native';

export type ParallaxConfig = {
  headerHeight?: number;
};

export function useParallaxHeader(config: ParallaxConfig = {}) {
  const { headerHeight = 180 } = config;
  const scrollY = useRef(new Animated.Value(0)).current;

  const animatedStyle = useMemo(() => {
    const scale = scrollY.interpolate({
      inputRange: [-headerHeight, 0, headerHeight],
      outputRange: [2, 1, 0.95],
      extrapolate: 'clamp',
    });
    const translateY = scrollY.interpolate({
      inputRange: [0, headerHeight],
      outputRange: [0, -headerHeight * 0.25],
      extrapolate: 'clamp',
    });
    return { transform: [{ translateY }, { scale }] } as const;
  }, [scrollY, headerHeight]);

  const onScroll = useMemo(
    () =>
      Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      ),
    [scrollY]
  );

  return { scrollY, animatedStyle, onScroll } as const;
}
