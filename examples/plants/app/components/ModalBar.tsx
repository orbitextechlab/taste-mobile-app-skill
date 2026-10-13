// The top bar inside the Thêm cây page sheet: the close affordance leading, the title. The native header is
// hidden so the modal has one owner of chrome. On iOS the sheet already starts below the status bar, so the
// top inset is skipped there and kept on Android, where the modal covers the status bar.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontFamily, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export function ModalBar({ title, onClose, insetTop }: { title: string; onClose: () => void; insetTop: boolean }) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insetTop ? insets.top : 0, backgroundColor: c.surface }]}>
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Đóng"
        android_ripple={{ color: c.divider, borderless: true }}
        style={({ pressed }) => [styles.close, { opacity: pressed ? 0.7 : 1 }]}
      >
        <MaterialIcons name="close" size={24} color={c.text} />
      </Pressable>
      <Text style={[styles.title, { color: c.text }]} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.s8 },
  close: { width: touch.min, height: touch.min, alignItems: 'center', justifyContent: 'center' },
  title: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '600', marginLeft: spacing.s4 },
});
