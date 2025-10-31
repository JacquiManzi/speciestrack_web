/**
 * API Usage Examples
 * This file demonstrates how to use the API structure in your components
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator } from 'react-native';
import { useApi, useApiMutation } from '../hooks/useApi';
import { getAllSpecies, createSpecies, getSpeciesById } from '../services';
import type { Species } from '../types/api';

/**
 * Example 1: Using the useApi hook for GET requests
 */
export function SpeciesListExample() {
  const { data, loading, error, refetch } = useApi(
    () => getAllSpecies({ page: 1, limit: 20 }),
    { immediate: true } // Fetch immediately on mount
  );

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
        <Button title="Retry" onPress={refetch} />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={data?.data || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.scientificName}</Text>
          </View>
        )}
      />
      <Button title="Refresh" onPress={refetch} />
    </View>
  );
}

/**
 * Example 2: Using useApiMutation for POST/PUT/DELETE requests
 */
export function CreateSpeciesExample() {
  const { mutate, loading, error, data } = useApiMutation(createSpecies);

  const handleCreate = async () => {
    try {
      const newSpecies = await mutate({
        name: 'Red Fox',
        scientificName: 'Vulpes vulpes',
        category: 'Mammal',
      });
      console.log('Created species:', newSpecies);
      // Handle success (e.g., navigate back, show toast)
    } catch (err) {
      // Error is already stored in state
      console.error('Failed to create species:', err);
    }
  };

  return (
    <View>
      <Button
        title="Create Species"
        onPress={handleCreate}
        disabled={loading}
      />
      {loading && <ActivityIndicator />}
      {error && <Text>Error: {error.message}</Text>}
      {data && <Text>Created: {data.name}</Text>}
    </View>
  );
}

/**
 * Example 3: Manual API calls without hooks
 */
export function ManualApiExample() {
  const [species, setSpecies] = useState<Species | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSpecies = async (id: string) => {
    setLoading(true);
    try {
      const data = await getSpeciesById(id);
      setSpecies(data);
    } catch (error) {
      console.error('Failed to fetch species:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecies('some-species-id');
  }, []);

  if (loading) return <ActivityIndicator />;
  if (!species) return <Text>No species found</Text>;

  return (
    <View>
      <Text>{species.name}</Text>
      <Text>{species.scientificName}</Text>
    </View>
  );
}

/**
 * Example 4: Using API client directly for custom requests
 */
import { apiClient } from '../api/client';

export async function customApiCall() {
  try {
    // Set auth token if needed
    apiClient.setAuthToken('your-token-here');

    // Make custom API call
    const response = await apiClient.get('/custom-endpoint', {
      customParam: 'value',
    });

    console.log('Response:', response);
  } catch (error) {
    console.error('API Error:', error);
  }
}

/**
 * Example 5: Debugging API configuration
 * Use this to verify which API URL is being used
 */
import { getCurrentApiUrl, isDevelopment } from '../config/api';
import { logApiConfig } from '../utils/debugApi';

export function ApiDebugExample() {
  useEffect(() => {
    // Log API configuration on mount
    logApiConfig();

    // Or manually check
    console.log('Is Development?', isDevelopment());
    console.log('Current API URL:', getCurrentApiUrl());
  }, []);

  return (
    <View>
      <Text>Environment: {isDevelopment() ? 'Development' : 'Production'}</Text>
      <Text>API URL: {getCurrentApiUrl()}</Text>
    </View>
  );
}
