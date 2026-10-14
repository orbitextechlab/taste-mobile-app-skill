// The run is a two-step full-screen group on the red field: live, then finish. No navigator header;
// each step owns its top row. The group is presented as a full-screen modal by the root stack.
import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../theme/useTheme';

export default function RunLayout() {
  const c = useTheme();
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.accent } }} />;
}
