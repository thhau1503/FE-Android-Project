import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

interface User {
  id: string;
  username: string;
  email: string;
  user_role: string;
  phone: string;
  address: string;
}

const NotificationScreen: React.FC = ({ navigation }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState([]);

  useLayoutEffect(() => {
    fetchNotifications();
    fetchUserProfile();
  }, []);
  const fetchNotifications = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const response = await axios.get(
        "https://be-android-project.onrender.com/api/notification",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(response.data);
    }
  };
  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
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
      } else {
        navigation.navigate("login");
      }
    } catch (error: any) {
      if (error.response && error.response.data.msg === "Token is not valid") {
        await AsyncStorage.removeItem("token");
        navigation.navigate("login");
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };
  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity style={styles.notificationItem}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3159/3159090.png",
          }}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {item.id_user ? item.id_user.username : "guest"}
          </Text>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.time}>
            {item.create_at
              ? formatDistanceToNow(new Date(item.create_at), {
                  addSuffix: true,
                })
              : "Unknown time"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  message: {
    color: "#666",
    fontSize: 14,
  },
  time: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 5,
  },
});

export default NotificationScreen;
