import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setData(data);
    alert(`QR Code scanned: ${data}`);
  };

  const handleProceedWithScannedData = async (code) => {
    console.log(code);
    
    try {
        const token = await AsyncStorage.getItem('userToken');

        // Make sure the token is available before proceeding
        if (!token) {
          alert('No token found. Please log in again.');
          return;
        }
      const response = await fetch(`http://192.168.8.137:9090/api/fuel-quota/balance?qrCode=${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
        // body: JSON.stringify({ scannedData: data }),
      });

      const result = await response.json();
      console.log('Response from API:', result);

      navigation.navigate('Fuel', { remainingQuota: result.remainingQuota, vehicleNo: result.vehicleNo });
    } catch (error) {
      console.error('Error sending data to API:', error);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const squareSize = Dimensions.get('window').width * 0.8; // 80% of the screen width

  return (
    <View style={[styles.container, { backgroundColor: "white" }]}>
      <View style={[styles.cameraContainer, { width: squareSize, height: squareSize }]}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      {scanned && (
        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
      )}
      <Text style={styles.text}>Scanned Data: {data}</Text>

      {/* Button that calls the API endpoint when clicked */}
      {scanned && (
        <Button
          title="Proceed with Scanned Data"
          onPress={() => handleProceedWithScannedData(data)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  cameraContainer: {
    overflow: 'hidden',
    borderRadius: 15, // Optional: rounds the corners
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: 'white',
    marginTop: 20,
  },
});
