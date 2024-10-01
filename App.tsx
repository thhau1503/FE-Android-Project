import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LoginScreen from "./src/components/login/LoginScreen";
import ProfileScreen from "./src/components/profile/ProfileScreen";
import RegisterScreen from "./src/components/register/RegisterScreen";
import OtpVerificationScreen from "./src/components/register/OtpVerificationScreen"; // Màn hình OTP
import TabNavigator from "./src/screens/TabNavigator";
import Detail from "./src/components/detail/Detail";
import { ActivityIndicator, View, Alert } from "react-native";
import Notification from "./src/components/notify/Notificaion";
import ForgotPasswordScreen from "./src/components/login/ForgotPasswordScreen";
const Stack = createStackNavigator();

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        console.log("token:", storedToken);
        if (storedToken) {
          const response = await axios.get(
            "https://be-android-project.onrender.com/api/auth/me",
            {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );
          // Nếu token hợp lệ, lưu token vào state
          setToken(storedToken);
        } else {
          // Nếu không có token, điều hướng về màn hình đăng nhập
          setToken(null);
        }
      } catch (error) {
        // Nếu token không hợp lệ hoặc có lỗi, chuyển về đăng nhập
        if (error.response && error.response.status === 401) {
          Alert.alert(
            "Session Expired",
            "Token is not valid. Please log in again."
          );
          setToken(null); // Token không hợp lệ, chuyển hướng về đăng nhập
        } else {
          console.error("Error fetching token or making request:", error);
        }
      } finally {
        setIsLoading(false); // Hoàn thành việc kiểm tra token
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
        initialRouteName={token ? "tab" : "login"} // Điều hướng dựa vào trạng thái của token
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="tab" component={TabNavigator} />
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="register" component={RegisterScreen} />
        <Stack.Screen name="otpVerification" component={OtpVerificationScreen} />
        <Stack.Screen name="profile" component={ProfileScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="detailItem" component={Detail} />
        <Stack.Screen name="notification" component={Notification} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
