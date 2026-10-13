// A link to a route that does not exist lands here with a way out, never on a blank screen.
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { EmptyState } from '../components/EmptyState';
import { useTheme } from '../theme/useTheme';

export default function NotFoundScreen() {
  const c = useTheme();
  const router = useRouter();
  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <EmptyState message="Không có trang này." actionLabel="Về Hôm nay" onAction={() => router.replace('/today')} />
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1, justifyContent: 'center' } });
