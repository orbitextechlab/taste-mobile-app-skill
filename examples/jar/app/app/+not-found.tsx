// A deep link to a route that does not exist explains itself and offers a way out; never a blank screen.
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { EmptyState } from '../components/EmptyState';
import { useTheme } from '../theme/useTheme';

export default function NotFound() {
  const c = useTheme();
  const router = useRouter();
  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <Stack.Screen options={{ title: 'Không có trang này' }} />
      <EmptyState message="Đường dẫn này không mở được màn hình nào trong Hũ." actionLabel="Về Tuần này" onAction={() => router.replace('/week')} />
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1 } });
