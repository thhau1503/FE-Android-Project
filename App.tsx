import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LoginScreen from "./src/components/login/LoginScreen";
import ProfileScreen from "./src/components/profile/ProfileScreen";
import RegisterScreen from "./src/components/register/RegisterScreen";
import TabNavigator from "./src/screens/TabNavigator";
import Detail from "./src/components/detail/Detail";
import { ActivityIndicator, View, Alert } from "react-native";

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        console.log(storedToken);
        if (storedToken) {
          const response = await axios.get(
            "https://be-android-project.onrender.com/api/auth/me",
            {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );
          // If the token is valid, set the token state
          setToken(storedToken);
        } else {
          // No token found, start with login screen
          setToken(null);
        }
      } catch (error) {
        // If the token is invalid or the request returns 401
        if (error.response && error.response.status === 401) {
          Alert.alert(
            "Session Expired",
            "Token is not valid. Please log in again."
          );
          setToken(null); // Invalid token, redirect to login
        } else {
          console.error("Error fetching token or making request:", error);
        }
      } finally {
        setIsLoading(false); // Mark token check as complete
      }
    };

    checkToken();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={token ? "tab" : "login"} // Redirect based on token validity
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="tab" component={TabNavigator} />
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="register" component={RegisterScreen} />
        <Stack.Screen name="profile" component={ProfileScreen} />
        <Stack.Screen name="DetailItem" component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
