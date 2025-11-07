import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function CityDetail() {
 // Use useLocalSearchParams to get the serialized cityData parameter
 const { cityData } = useLocalSearchParams<{ cityData: string }>();

 // If cityData is undefined or null, return a fallback message
 if (!cityData) return <Text>No city data available</Text>;

 // Parse cityData since it's passed as a JSON string
 const parsedCityData = JSON.parse(cityData);
 return (
 <View style={styles.detailContainer}>
    <Text style={styles.cityName}>{parsedCityData.name}</Text>
    <Text>Temperature: {parsedCityData.temp}</Text>
    <Text>Conditions: {parsedCityData.description}</Text>
    <Text>Humidity: {parsedCityData.humidity}</Text>
    <Text>Wind Speed: {parsedCityData.windSpeed}</Text>
    <Image
      style={{ width: 100, height: 100 }}
      source={{
        uri: `https://openweathermap.org/img/wn/${parsedCityData.icon}.png`,
      }}
    />
 </View>
 );
}

const styles = StyleSheet.create({
 detailContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   padding: 20
 },
 cityName: {
   fontSize: 24,
   fontWeight: 'bold',
   marginBottom: 10
 },
});