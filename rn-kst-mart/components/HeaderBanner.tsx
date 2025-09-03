import React from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {
  animatedStyle?: object;
  horizontalPadding?: number;
  height?: number;
  marginTop?: number;
};

const HeaderBanner: React.FC<Props> = ({
  animatedStyle = {},
  horizontalPadding = 16,
  marginTop = -8,
  height = 180,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const imageWidth = SCREEN_WIDTH + horizontalPadding * 2;
  // Overscan the image to avoid revealing background on iOS bounce/scale
  const overscan = Math.max(24, Math.round(height * 0.25));
  const renderedHeight = height + overscan * 2;
  const imageStyle = [
    { width: imageWidth, height: renderedHeight, position: 'absolute', top: -overscan, left: 0 },
    animatedStyle,
  ] as any;
  const bgImageStyle = {
    width: imageWidth,
    height,
    position: 'absolute' as const,
    top: 0,
    left: 0,
  };

  return (
    <View
      style={{
        marginHorizontal: -horizontalPadding,
        marginTop,
        overflow: 'hidden',
        height,
        alignItems: 'center',
        position: 'relative',
        backgroundColor: colorScheme === 'dark' ? '#111' : '#eee',
      }}
    >
      <Animated.Image
        source={require('@/assets/images/cat-env.png')}
        style={bgImageStyle as any}
        resizeMode="cover"
      />
      <Animated.Image
        source={require('@/assets/images/cat-env.png')}
        style={imageStyle}
        resizeMode="cover"
      />
    </View>
  );
};

export default HeaderBanner;
