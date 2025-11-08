/**
 * FilterPanel Component
 * Provides date filtering and search functionality for native plants
 */

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Pressable } from 'react-native';
import { DatePickerInput } from './DatePickerInput';

export interface FilterValues {
  startTime?: string;
  endTime?: string;
  commonName?: string;
  scientificName?: string;
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterValues) => void;
  isVisible: boolean;
  onClose: () => void;
}

type DateFilterMode = 'year' | 'month' | 'week' | 'day';

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onFilterChange,
  isVisible,
  onClose,
}) => {
  const currentYear = new Date().getFullYear();
  const [filterMode, setFilterMode] = useState<DateFilterMode>('year');
  const [startDate, setStartDate] = useState<Date>(new Date(currentYear, 0, 1));
  const [endDate, setEndDate] = useState<Date>(new Date(currentYear, 11, 31));
  const [commonName, setCommonName] = useState<string>('');
  const [scientificName, setScientificName] = useState<string>('');

  if (!isVisible) return null;

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const applyQuickFilter = (mode: DateFilterMode) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    switch (mode) {
      case 'year':
        setStartDate(new Date(year, 0, 1));
        setEndDate(new Date(year, 11, 31));
        break;
      case 'month':
        setStartDate(new Date(year, month, 1));
        setEndDate(new Date(year, month + 1, 0));
        break;
      case 'week': {
        const dayOfWeek = now.getDay();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - dayOfWeek);
        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + (6 - dayOfWeek));
        setStartDate(startOfWeek);
        setEndDate(endOfWeek);
        break;
      }
      case 'day':
        setStartDate(new Date(year, month, now.getDate()));
        setEndDate(new Date(year, month, now.getDate()));
        break;
    }
    setFilterMode(mode);
  };

  const applyFilters = () => {
    const filters: FilterValues = {
      startTime: `${formatDate(startDate)}T00:00:00`,
      endTime: `${formatDate(endDate)}T23:59:59`,
    };

    if (commonName.trim()) {
      filters.commonName = commonName.trim();
    }

    if (scientificName.trim()) {
      filters.scientificName = scientificName.trim();
    }

    console.log('Applying filters:', filters);
    console.log('Start date:', formatDate(startDate));
    console.log('End date:', formatDate(endDate));

    onFilterChange(filters);
    onClose();
  };

  const clearFilters = () => {
    const year = new Date().getFullYear();
    setStartDate(new Date(year, 0, 1));
    setEndDate(new Date(year, 11, 31));
    setCommonName('');
    setScientificName('');
    setFilterMode('year');
    onFilterChange({
      startTime: `${year}-01-01T00:00:00`,
      endTime: `${year}-12-31T23:59:59`,
    });
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Quick Filters</Text>
        <View style={styles.modeButtons}>
          {(['year', 'month', 'week', 'day'] as DateFilterMode[]).map(
            (mode) => (
              <Pressable
                key={mode}
                style={[
                  styles.modeButton,
                  filterMode === mode && styles.modeButtonActive,
                ]}
                onPress={() => applyQuickFilter(mode)}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    filterMode === mode && styles.modeButtonTextActive,
                  ]}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
              </Pressable>
            )
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Date Range</Text>
        <View style={styles.dateRow}>
          <View style={styles.dateColumn}>
            <Text style={styles.dateLabel}>Start</Text>
            <DatePickerInput value={startDate} onChange={setStartDate} />
          </View>
          <View style={styles.dateColumn}>
            <Text style={styles.dateLabel}>End</Text>
            <DatePickerInput value={endDate} onChange={setEndDate} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Search by Name</Text>
        <TextInput
          style={styles.input}
          value={commonName}
          onChangeText={setCommonName}
          placeholder="Common name (e.g., Oak)"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          value={scientificName}
          onChangeText={setScientificName}
          placeholder="Scientific name (e.g., Quercus)"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </Pressable>
        <Pressable style={styles.clearButton} onPress={clearFilters}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  section: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  modeButtons: {
    flexDirection: 'row',
    marginBottom: 6,
    gap: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#7CB342',
  },
  modeButtonText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    marginBottom: 6,
    backgroundColor: '#fff',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dateColumn: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 6,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#7CB342',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 12,
  },
});
