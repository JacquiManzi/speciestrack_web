/**
 * DatePicker Component
 * Cross-platform date picker (optimized for web)
 */

import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

interface DatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
  style?: any;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  style,
}) => {
  if (Platform.OS === 'web') {
    // Use HTML5 date input for web
    return (
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 4,
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 8,
          paddingBottom: 8,
          fontSize: 12,
          backgroundColor: '#fff',
          width: '100%',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          ...style,
        }}
      />
    );
  }

  // For native platforms, you would use @react-native-community/datetimepicker
  // For now, fallback to text display
  return (
    <View style={styles.nativeFallback}>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 4,
          padding: 8,
          fontSize: 12,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  nativeFallback: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
  },
});
