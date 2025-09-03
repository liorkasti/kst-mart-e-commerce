import React from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import HeaderBanner from './HeaderBanner';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

type Props = {
  title?: string;
  animatedStyle?: object;
  horizontalPadding?: number;
  height?: number;
  children?: React.ReactNode;
};

const HeaderHero=({
  title = 'Product Categories',
  animatedStyle,
  horizontalPadding = 16,
  height = 180,
  children,
}: Props) =>{
  const headerPaddingTop =
    Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 44;

  return (
    <>
      <HeaderBanner
        animatedStyle={animatedStyle}
        horizontalPadding={horizontalPadding}
        height={height}
      />

      <ThemedView
        style={[styles.titleContainer, { paddingTop: headerPaddingTop + 8 }]}
      >
        <ThemedText type="title">{title}</ThemedText>
      </ThemedView>

      {children}
    </>
  );
}

export default HeaderHero

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});
