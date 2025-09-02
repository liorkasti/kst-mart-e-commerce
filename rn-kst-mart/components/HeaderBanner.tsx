import React from 'react';
import { Animated, Dimensions, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = {
  animatedStyle?: object;
  horizontalPadding?: number;
  height?: number;
  marginTop?: number;
};

export default function HeaderBanner({
  animatedStyle = {},
  horizontalPadding = 16,
  marginTop = -8,
  height = 180,

}: Props) {
  const imageWidth = SCREEN_WIDTH + horizontalPadding * 2;
  const imageStyle = [{ width: imageWidth, height }, animatedStyle] as any;

  return (
    <View
      style={{
        marginHorizontal: -horizontalPadding,
        marginTop,
        overflow: 'hidden',
        height,
        alignItems: 'center',
      }}
    >
      <Animated.Image
        source={require('@/assets/images/cat-env.png')}
        style={imageStyle}
        resizeMode="cover"
      />
    </View>
  );
}
