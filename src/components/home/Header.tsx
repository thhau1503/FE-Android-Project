import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
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
  const [char, setChar] = useState<string>(""); // Chữ cái đại diện
  const [searchText, setSearchText] = useState<string>(""); // Giá trị tìm kiếm
  const navigationUse = useNavigation();

  // Fetch thông tin người dùng
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
          setChar(response.data.username.charAt(0).toUpperCase());
        } else {
          navigation.navigate("login");
        }
      } catch (error: any) {
        if (
          error.response &&
          error.response.data.msg === "Token is not valid"
        ) {
          await AsyncStorage.removeItem("token");
          navigation.navigate("login");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Xử lý nút Bộ lọc
  const handleFilter = () => {
    console.log("Filter button clicked");
    // Thêm logic mở modal hoặc xử lý bộ lọc tại đây
  };

  return (
    <View style={{ paddingTop: 5 }}>
      {/* Avatar + Thông báo */}
      <View style={styles.container}>
        <View style={styles.charCircle}>
          <Text style={styles.charText}>{char}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("notification");
          }}
        >
          <MaterialCommunityIcons name="bell" size={30} color="#342061" />
        </TouchableOpacity>
      </View>

      {/* Chào người dùng */}
      <View style={{ marginVertical: 5, flexDirection: "column" }}>
        <Text style={{ fontSize: 13, fontWeight: "600" }}>
          Hello, {user?.username || "Guest"}!
        </Text>

        {/* Thanh tìm kiếm + Nút Bộ lọc */}
        <View style={styles.searchFilterContainer}>
          {/* Search Box */}
          <View style={styles.searchBox}>
            <Ionicons
              name="location-outline"
              size={20}
              color="#6E6E6E"
              style={styles.locationIcon}
            />
            <TextInput
              placeholder="Tìm theo khu vực"
              placeholderTextColor="#6E6E6E"
              style={styles.searchInput}
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
            />
          </View>

          {/* Filter Button */}
          <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
            <MaterialIcons name="filter-list" size={20} color="#000" />
            <Text style={styles.filterText}>Bộ lọc</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    borderRadius: 25, // Hình tròn
    backgroundColor: "#1963ca",
    justifyContent: "center",
    alignItems: "center",
  },
  charText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  searchFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    borderRadius: 30,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    marginTop: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 8,
    paddingLeft: 10,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    paddingVertical: 0,
    marginLeft: 6,
  },
  locationIcon: {
    marginLeft: 6,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
    color: "#000",
  },
});

export default Header;
