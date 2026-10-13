// The close bar of the Ghi chi tiêu modal: a 48 pt close target leading, the title beside it. On iOS the page
// sheet already starts below the status bar, so insetTop is false there and true on Android [R-SA1].
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

type Props = { title: string; onClose: () => void; insetTop: boolean };

export function TopBar({ title, onClose, insetTop }: Props) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insetTop ? insets.top : 0 }]}>
      <View style={styles.bar} accessibilityRole="header">
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Đóng"
          hitSlop={4}
          android_ripple={{ color: c.divider, borderless: true }}
          style={({ pressed }) => [styles.close, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="close" size={24} color={c.text} />
        </Pressable>
        <Text style={[styles.title, { color: c.text }]}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.s4 },
  bar: { height: touch.min + spacing.s4, flexDirection: 'row', alignItems: 'center', gap: spacing.s4 },
  close: { width: touch.min, height: touch.min, alignItems: 'center', justifyContent: 'center' },
  title: { ...type.bodyLg, fontWeight: '600' },
});
