/**
 * DatePickerInput Component
 * A cross-platform date picker using @react-native-community/datetimepicker for mobile
 * and native HTML input for web
 */

import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerInputProps {
  value: Date;
  onChange: (date: Date) => void;
  style?: any;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  onChange,
  style,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleWebDateChange = (event: any) => {
    const dateValue = event.target.value;
    if (dateValue) {
      const [year, month, day] = dateValue.split('-').map(Number);
      onChange(new Date(year, month - 1, day));
    }
  };

  // For web platform, use native HTML date input with proper event handling
  if (Platform.OS === 'web') {
    return (
      <View style={style}>
        <input
          type="date"
          value={formatDate(value)}
          onChange={handleWebDateChange}
          style={{
            width: '100%',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '8px',
            fontSize: '12px',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backgroundColor: '#fff',
            cursor: 'pointer',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            // Force show picker on some browsers
            try {
              (e.target as any).showPicker?.();
            } catch (error) {
              // showPicker might not be supported in all browsers
            }
          }}
        />
      </View>
    );
  }

  // For iOS and Android, use DateTimePicker
  return (
    <View style={style}>
      <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
        <Text style={styles.inputText}>{formatDate(value)}</Text>
        <Text style={styles.icon}>📅</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          onTouchCancel={() => setShowPicker(false)}
        />
      )}

      {/* For iOS, show a done button */}
      {showPicker && Platform.OS === 'ios' && (
        <View style={styles.iosControls}>
          <Pressable
            style={styles.doneButton}
            onPress={() => setShowPicker(false)}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 12,
    color: '#333',
  },
  icon: {
    fontSize: 14,
  },
  iosControls: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  doneButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#7CB342',
    borderRadius: 4,
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
