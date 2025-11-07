import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Ayden's Weather App",
          headerStyle: {
            backgroundColor: '#1584c5ff', // Background color of the bar
            },
            headerTintColor: '#FFFFFF', // Color of the title text
            headerTitleStyle: {
              fontWeight: 'bold', // Text styling for the title
              fontSize: 24,
            },
        }}
      />
       {/* Detail Screen */}
      <Stack.Screen
        name="cityDetails"
        options={{
          title: "City Details",
          headerStyle: {
            backgroundColor: '#1584c5ff',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 24,
            },
        }}
      />
    </Stack>
  );
}
