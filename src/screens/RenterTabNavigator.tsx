import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProfileScreen from "../components/profile/ProfileScreen";
import ManageListingsScreen from "../components/renter/ManageListingsScreen";
import AddListingScreen from "../components/renter/AddListingScreen";
import ManageBookingsScreen from "../components/renter/ManageBookingsScreen"; // Tab Quản lý đặt lịch

const Tab = createBottomTabNavigator();

const optionScreen = ({ route }: any) => ({
  tabBarIcon: ({ focused, color, size }: any) => {
    let iconName: string = "";

    if (route.name === "Quản lý trọ") {
      iconName = focused ? "list" : "list-outline";
    } else if (route.name === "Thêm trọ") {
      iconName = focused ? "add-circle" : "add-circle-outline";
    } else if (route.name === "Quản lý đặt lịch") {
      iconName = focused ? "calendar" : "calendar-outline";
    } else if (route.name === "Profile") {
      iconName = focused ? "person-circle" : "person-circle-outline";
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: "blue",
  tabBarInactiveTintColor: "gray",
  headerShown: false,
  tabBarStyle: { backgroundColor: "#f0f0f0" },
  tabBarLabelStyle: { fontSize: 12, fontWeight: "bold", color: "black" },
});

const RenterTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={optionScreen}>
      <Tab.Screen name="Quản lý trọ" component={ManageListingsScreen} />
      <Tab.Screen name="Thêm trọ" component={AddListingScreen} />
      <Tab.Screen name="Quản lý đặt lịch" component={ManageBookingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default RenterTabNavigator;
