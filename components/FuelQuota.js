import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FuelQuota = ({ route, navigation }) => {
  const { remainingQuota, vehicleNo } = route.params; // Get the passed parameters
  const [inputValue, setInputValue] = useState(0);

  const handleSubmit = async () => {
    const apiUrl = 'http://192.168.8.137:9090/api/fuel-quota/reduce'; 

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
    <View style={styles.container}>
      <Text style={styles.text}>Vehicle No: {vehicleNo}</Text>
      <Text style={styles.text}>Remaining Quota: {remainingQuota}</Text>
      
      {/* Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Enter value"
        value={inputValue}
        onChangeText={setInputValue} // Update state on text change
      />
      
      {/* Submit Button */}
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
});

export default FuelQuota;
