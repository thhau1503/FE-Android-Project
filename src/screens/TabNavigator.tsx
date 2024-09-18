import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "../components/home/HomeScreen";
import CartScreen from "../components/cart/CartScreen";
import ProfileScreen from "../components/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

const optionScreen = ({ route }: any) => ({
  tabBarIcon: ({ focused, color, size }: any) => {
    let iconName: string = "";

    if (route.name === "home") {
      iconName = focused ? "home" : "home-outline";
    } else if (route.name === "login") {
      iconName = focused ? "settings-sharp" : "settings-outline";
    } else if (route.name === "account") {
      iconName = focused ? "person-circle" : "person-circle-outline";
    } else if (route.name === "accountstack") {
      iconName = focused ? "person-circle" : "person-circle-outline";
    } else if (route.name === "nyc") {
      iconName = focused ? "heart-dislike-sharp" : "heart-dislike-outline";
    } else if (route.name === "notification") {
      iconName = focused ? "notifications-sharp" : "notifications-outline";
    } else if (route.name === "note") {
      iconName = focused ? "book" : "book-outline";
    } else if (route.name === "cart") {
      iconName = focused ? "cart" : "cart-outline";
    } else if (route.name === "profile") {
      iconName = focused ? "person-circle" : "person-circle-outline";
    } else if (route.name === "trang chủ") {
      iconName = focused ? "home" : "home-outline";
    }

    // You can return any component that you like here!
    return <Ionicons name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: "black",
  tabBarInactiveTintColor: "tomato",
  headerShown: false,
  tabBarStyle: { backgroundColor: "#1bcdff" },
  tabBarLabelStyle: { color: "black", fontweight: "bold" },
});

const TabNavigator = () => {
  return (
    <>
      <Tab.Navigator screenOptions={optionScreen}>
        <Tab.Screen name="trang chủ" component={HomeScreen}></Tab.Screen>
        <Tab.Screen name="cart" component={CartScreen}></Tab.Screen>
        <Tab.Screen name="profile" component={ProfileScreen}></Tab.Screen>
      </Tab.Navigator>
    </>
  );
};

export default TabNavigator;