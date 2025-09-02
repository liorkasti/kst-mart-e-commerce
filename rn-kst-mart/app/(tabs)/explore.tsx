import { StyleSheet } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About</ThemedText>
      </ThemedView>

      <ThemedText>
        I build reliable, maintainable mobile apps and work collaboratively to
        deliver value to users. I focus on clean code, clear communication, and
        helping teammates move forward.
      </ThemedText>

      <Collapsible title="What I bring to a team">
        <ThemedText>- Strong React Native & TypeScript experience</ThemedText>
        <ThemedText>
          - Practical Expo workflows and component-driven UI
        </ThemedText>
        <ThemedText>
          - Clear, empathetic communication and code reviews
        </ThemedText>
        <ThemedText>
          - Prioritize shipping small, testable improvements
        </ThemedText>
      </Collapsible>

      <Collapsible title="Strengths as a teammate">
        <ThemedText>
          I enjoy pairing, mentoring, and owning cross-team tasks. I make PRs
          small and reviewable, write helpful PR descriptions, and aim for
          predictable delivery.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Contact & links">
        <ThemedText>Please contact me via email:</ThemedText>
        <ExternalLink href="mailto:you@example.com">
          <ThemedText type="link">Email: liorkasti@gmail.com</ThemedText>
        </ExternalLink>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
