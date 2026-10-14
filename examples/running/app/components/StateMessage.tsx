// Empty and error states: one sentence of what belongs here and one action. The only centered
// composition in the app, because it is a single message.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { PillButton, type PillVariant } from './PillButton';

type Props = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: PillVariant;
  onField?: boolean;
  inline?: boolean;
};

export function StateMessage({ message, actionLabel, onAction, actionVariant = 'outline', onField = false, inline = false }: Props) {
  const c = useTheme();
  return (
    <View style={[styles.wrap, inline ? styles.inline : styles.fill]}>
      <Text style={[styles.text, { color: onField ? c.onField : c.textMuted }]}>{message}</Text>
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <PillButton label={actionLabel} onPress={onAction} variant={actionVariant} onField={onField} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.s24, gap: spacing.s16, alignItems: 'center' },
  fill: { flex: 1, justifyContent: 'center', paddingVertical: spacing.s48 },
  inline: { paddingVertical: spacing.s32 },
  text: { ...type.bodyLg, textAlign: 'center' },
  action: { flexDirection: 'row' },
});
