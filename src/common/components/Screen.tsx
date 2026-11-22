import React, { ReactNode } from 'react';
import { ScrollView, View, StyleSheet, ViewStyle, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';

interface Props {
  children: ReactNode;
  scroll?: boolean;
  tabs?: boolean; // leave space for the floating tab bar
  dark?: boolean;
  style?: ViewStyle;
  footer?: ReactNode; // fixed bottom area (e.g. a big button)
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function Screen({ children, scroll = true, tabs = false, dark = false, style, footer, refreshing, onRefresh }: Props) {
  const insets = useSafeAreaInsets();
  const bg = { backgroundColor: dark ? colors.dark : colors.bg };
  const padding = {
    paddingTop: insets.top + 12,
    paddingBottom: footer ? 20 : (tabs ? 110 : 28) + insets.bottom,
  };

  return (
    <View style={[styles.flex, bg]}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.content, padding, style]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} /> : undefined}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, styles.content, padding, style]}>{children}</View>
      )}
      {footer ? <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 14 },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: colors.surface,
    shadowColor: colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -6 },
    elevation: 8,
  },
});