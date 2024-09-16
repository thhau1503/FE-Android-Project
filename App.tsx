import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./src/components/login/LoginScreen";
import ProfileScreen from "./src/components/profile/ProfileScreen";
import RegisterScreen from "./src/components/register/RegisterScreen";
import TabNavigator from "./src/screens/TabNavigator";
import Detail from "./src/components/detail/Detail";
import { ActivityIndicator, View } from "react-native";

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);
      } catch (error) {
        console.error("Error fetching token:", error);
      } finally {
        setIsLoading(false); // Đánh dấu việc kiểm tra token đã hoàn thành
      }
    };

    checkToken();
  }, []);

  // Hiển thị ActivityIndicator trong khi đang kiểm tra token
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
        initialRouteName={token ? "tab" : "login"} // Nếu có token, chuyển tới 'tab', nếu không thì 'login'
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
