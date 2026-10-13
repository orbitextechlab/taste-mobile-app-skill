// One sentence of what belongs here and one action. Centered: the single-message exception to the leading axis.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontFamily, spacing, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { Button } from './Button';

type Props = { message: string; actionLabel?: string; onAction?: () => void; primary?: boolean };

export function EmptyState({ message, actionLabel, onAction, primary = false }: Props) {
  const c = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.text, { color: c.textMuted }]}>{message}</Text>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} variant={primary ? 'filled' : 'outlined'} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.s20, paddingVertical: spacing.s32, gap: spacing.s16, alignItems: 'center' },
  text: { ...type.bodyLg, fontFamily: fontFamily.ui, textAlign: 'center' },
});
