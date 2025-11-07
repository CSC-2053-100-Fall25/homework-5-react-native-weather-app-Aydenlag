import * as Location from 'expo-location';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [cityWeatherList, setCityWeatherList] = useState<any>(null);

  // List of additional cities with their coordinates
  const additionalCities = [
    { name: "New York", latitude: 40.7128, longitude: -74.0060 },
    { name: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
    { name: "Chicago", latitude: 41.8781, longitude: -87.6298 },
    { name: "Houston", latitude: 29.7604, longitude: -95.3698 },
    { name: "Miami", latitude: 25.7617, longitude: -80.1918 },
    { name: "London", latitude: 51.5074, longitude: -0.1278 },
    { name: "Tokyo", latitude: 35.6895, longitude: 139.6917 },
    { name: "Sydney", latitude: -33.8688, longitude: 151.2093 },
    { name: "Paris", latitude: 48.8566, longitude: 2.3522 },
    { name: "Berlin", latitude: 52.5200, longitude: 13.4050 },
  ];

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });
    };
    getLocation();
  }, []);

  useEffect(() => {
    const fetchAllWeather = async () => {
      if (!location) return;

      // Fetch weather for user's location
      const userWeatherData = await fetchWeather(location.latitude, location.longitude, "Your Location");
      let userWeather = null;
      if (userWeatherData && userWeatherData.cod === 200) {
        userWeather = {
          name: "Your Location",
          temp: userWeatherData.main?.temp,
          description: userWeatherData.weather?.[0]?.description,
          icon: userWeatherData.weather?.[0]?.icon,
          humidity: userWeatherData.main?.humidity,
          windSpeed: userWeatherData.wind?.speed,
        };
      }

      // Fetch weather for additional cities
      const cityWeatherPromises = additionalCities.map(async (city) => {
        const cityWeatherData = await fetchWeather(city.latitude, city.longitude, city.name);
        if (cityWeatherData && cityWeatherData.cod === 200) {
          return {
            name: city.name,
            temp: cityWeatherData.main?.temp,
            description: cityWeatherData.weather?.[0]?.description,
            icon: cityWeatherData.weather?.[0]?.icon,
            humidity: cityWeatherData.main?.humidity,
            windSpeed: cityWeatherData.wind?.speed,
          };
        } else {
          return null;
        }
      });
      const cityWeatherResults = await Promise.all(cityWeatherPromises);
      setCityWeatherList([userWeather, ...cityWeatherResults.filter(Boolean)]);
    };

    fetchAllWeather();
  }, [location]);

  const fetchWeather = async (latitude: number | string, longitude: number | string, cityName: string) => {
    const apiKey = '28944c500366287577ea067dcb831e3e';
    const lat = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
    const lon = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  if (!cityWeatherList) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading weather...</Text>
        {errorMsg && <Text>{errorMsg}</Text>}
      </View>
    );
  }

  const speakWeather = (cityWeather: any) => {
    const message = `The weather in ${cityWeather.name} is ${cityWeather.description}, with a temperature of ${cityWeather.temp}`;
      Speech.speak(message, {
        rate: 0.9, // Speed of speech (0.5 = slow, 2.0 = fast)
        pitch: 1.0, // Pitch of voice
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
  };

  return (
    <View style={styles.container}>
      <Text>Weather in Your Location and Other Cities:</Text>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <FlatList
          data={cityWeatherList}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/cityDetails',
                  params: { cityData: JSON.stringify(item) },
                })
              }
            >
              <View style={{ padding: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.title}>{item.name}</Text>
                  <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 10 }}>
                    {item.icon ? (
                    <Image
                      style={{ width: 50, height: 50 }}
                      source={{ uri: `https://openweathermap.org/img/wn/${item.icon}.png` }}
                    />
                  ) : null}
                  <Text style={styles.text}>Temperature: {item.temp}</Text>
                  <Text style={styles.text}>Conditions: {item.description}</Text>
                  </View>
                  
                  {/* Add this button for text-to-speech */}
                  <View style={{ flexDirection: 'column', marginTop: 10}}>
                    <Button
                      title="Speak Weather"
                      onPress={() => speakWeather(item)}
                    />
                    <Button title="🔇 Stop" onPress={stopSpeaking} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 12,
  }
});