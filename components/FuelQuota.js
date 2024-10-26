import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const FuelQuota = ({ route, navigation }) => {

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); 
      navigation.replace('Login'); 
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="Logout" onPress={handleLogout} color="red" />
      ),
    });
  }, [navigation]);

  const { remainingQuota, vehicleNo } = route.params; 
  const maxQuota = 30; 
  const [inputValue, setInputValue] = useState(0);

  const handleSubmit = async () => {
    const apiUrl = BASE_URL+'/fuel-quota/reduce'; 

    const body = {
      vehicleNo: vehicleNo,
      quota: inputValue,
    };

    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        alert('No token found. Please log in again.');
        return;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const responseText = await response.text();

      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          Alert.alert('Success', 'Data sent successfully!');
          navigation.navigate('Scanner');
        } catch (parseError) {
          // If parsing fails, assume responseText is not JSON
          Alert.alert('Success', responseText);
          navigation.navigate('Scanner');
        }
      } else {
        Alert.alert('Error', responseText || 'Failed to send data.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred: ' + error.message);
      console.log(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>Vehicle No: {vehicleNo}</Text>

        {/* Circular Progress Bar */}
        <AnimatedCircularProgress
          size={150}
          width={18}
          fill={(remainingQuota / maxQuota) * 100} // Calculate percentage
          tintColor="#3b5998"
          backgroundColor="#e0e0e0"
          style={styles.progressBar}
        >
          {() => (
            <Text style={styles.quotaText}>
              {remainingQuota} / {maxQuota}
            </Text>
          )}
        </AnimatedCircularProgress>

        {/* Input Field */}
        <TextInput
          style={styles.input}
          placeholder="Enter value"
          value={inputValue}
          onChangeText={setInputValue} // Update state on text change
          keyboardType="numeric" // Make the keyboard numeric for input
        />

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button title="Submit" onPress={handleSubmit} color="#3b5998" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  progressBar: {
    marginVertical: 20,
  },
  quotaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    width: '80%',
    height: 45,
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
  },
});

export default FuelQuota;
