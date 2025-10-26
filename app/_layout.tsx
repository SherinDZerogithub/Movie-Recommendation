import { Stack } from "expo-router";
import { LogBox } from 'react-native';
import './globals.css';

// Suppress Reanimated strict-mode warnings that often originate
// from third-party components. We ignore both the specific messages
// and the `[Reanimated]` prefix so the Metro console isn't spammed.
// If you prefer to fix the root cause, remove these lines and address
// any shared-value `.value` reads/writes during render in the
// offending components (see Reanimated docs).
LogBox.ignoreLogs([
  '[Reanimated]',
  'Reanimated',
  'Reading from `value` during component render',
  'Writing to `value` during component render',
]);

export default function RootLayout() {
  return <Stack>

    {/* Hiding the group rout (tabs) */}
    <Stack.Screen
    name= "(tabs)"
    options={{ headerShown : false}}
    />
  {/*   we also wanna repeat it */}
  <Stack.Screen
   name= "movies/[id]"
    options={{ headerShown : false}}
  />
  </Stack>
}
