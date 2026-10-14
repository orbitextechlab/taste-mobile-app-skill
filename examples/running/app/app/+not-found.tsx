// A stale or wrong link lands here, explained, with a way out. Never a blank screen.
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StateMessage } from '../components/StateMessage';
import { useTheme } from '../theme/useTheme';

export default function NotFoundScreen() {
  const c = useTheme();
  const router = useRouter();
  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <StateMessage message="Không có trang này. Liên kết có thể đã cũ hoặc buổi chạy đã bị xóa." actionLabel="Về Hôm nay" onAction={() => router.replace('/today')} />
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1 } });
