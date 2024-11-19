import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  ActivityIndicator,
  View,
  Alert,
} from "react-native";

// Import Screens
import LoginScreen from "./src/components/login/LoginScreen";
import ProfileScreen from "./src/components/profile/ProfileScreen";
import RegisterScreen from "./src/components/register/RegisterScreen";
import OtpVerificationScreen from "./src/components/register/OtpVerificationScreen";
import TabNavigator from "./src/screens/TabNavigator"; // Tab dành cho User
import RenterTabNavigator from "./src/screens/RenterTabNavigator"; // Tab dành cho Renter
import Detail from "./src/components/detail/Detail";
import Notification from "./src/components/notify/Notificaion";
import ForgotPasswordScreen from "./src/components/login/ForgotPasswordScreen";
import VerifyOTPScreen from "./src/components/login/VerifyOTPScreen";

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string>("login"); // Mặc định là màn hình đăng nhập

  useEffect(() => {
    const checkTokenAndRole = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Stored Token:", token);

        if (token) {
          // Xác thực token và lấy thông tin người dùng
          const response = await axios.get(
            "https://be-android-project.onrender.com/api/auth/me",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const userRole = response.data.user_role;
          console.log("User Role:", userRole);

          // Điều hướng dựa trên vai trò
          if (userRole === "Renter") {
            setInitialRoute("renterTab");
          } else {
            setInitialRoute("userTab");
          }
        } else {
          setInitialRoute("login"); // Không có token, chuyển về đăng nhập
        }
      } catch (error) {
        console.error("Error checking token and role:", error);

        // Nếu token không hợp lệ hoặc lỗi, chuyển về đăng nhập
        if (error.response && error.response.status === 401) {
          Alert.alert(
            "Session Expired",
            "Your session has expired. Please log in again."
          );
        }

        setInitialRoute("login");
      } finally {
        setIsLoading(false); // Hoàn thành việc kiểm tra
      }
    };

    checkTokenAndRole();
  }, []);

  // Hiển thị trạng thái đang tải
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
        initialRouteName={initialRoute} // Điều hướng ban đầu dựa trên vai trò
        screenOptions={{ headerShown: false }}
      >
        {/* Tab dành cho User */}
        <Stack.Screen name="userTab" component={TabNavigator} />

        {/* Tab dành cho Renter */}
        <Stack.Screen name="renterTab" component={RenterTabNavigator} />

        {/* Auth Screens */}
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="register" component={RegisterScreen} />
        <Stack.Screen
          name="otpVerification"
          component={OtpVerificationScreen}
        />
        <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

        {/* Other Screens */}
        <Stack.Screen name="profile" component={ProfileScreen} />
        <Stack.Screen name="detailItem" component={Detail} />
        <Stack.Screen name="notification" component={Notification} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
