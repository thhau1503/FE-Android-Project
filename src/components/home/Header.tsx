import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface User {
  id: string;
  username: string;
  email: string;
  user_role: string;
  phone: string;
  address: string;
}

const Header = ({ navigation }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [char, setChar] = useState<string>("");
  const navigationUse = useNavigation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("token:", token);
        if (token) {
          const response = await axios.get(
            "https://be-android-project.onrender.com/api/auth/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(response.data);
          setChar(user.username.charAt(0).toUpperCase());
        } else {
          navigation.navigate("login");
        }
      } catch (error: any) {
        // Nếu lỗi liên quan đến token không hợp lệ, logout và điều hướng người dùng về login
        if (
          error.response &&
          error.response.data.msg === "Token is not valid"
        ) {
          await AsyncStorage.removeItem("token"); // Xóa token không hợp lệ
          navigation.navigate("login"); // Điều hướng về màn hình login
        } else {
          console.error(error); // Xử lý các lỗi khác (nếu có)
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <>
      <View style={{ paddingTop: 5 }}>
        <View style={styles.container}>
          <View style={styles.charCircle}>
            <Text style={styles.charText}>{char}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigationUse.navigate("notification");
            }}
          >
            <MaterialCommunityIcons name="bell" size={30} color="#342061" />
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 5, flexDirection: "column" }}>
          <Text style={{ fontSize: 13, fontWeight: "600" }}>
            Hello, {user.username}!
          </Text>

          <View style={{ marginVertical: 12 }}>
            <View
              style={{
                width: "100%",
                height: 48,
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 22,
              }}
            >
              <TextInput
                placeholder="Search"
                placeholderTextColor={"black"}
                style={{ width: "100%" }}
                onChangeText={(value) => {}}
              />
              <TouchableOpacity
                style={{ position: "absolute", right: 1 }}
                onPress={() => {}}
              >
                <Ionicons name="search-circle-outline" size={50} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  charCircle: {
    height: 50,
    width: 50,
    borderRadius: 25, // Make it a perfect circle
    backgroundColor: "#1963ca",
    justifyContent: "center", // Vertically center the text
    alignItems: "center", // Horizontally center the text
  },
  charText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Header;
