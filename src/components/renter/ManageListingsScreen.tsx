import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ManageListingsScreen = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [landlordId, setLandlordId] = useState(null);

  // Fetch landlordId and user info
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
        console.log("User profile:", response.data);
        setLandlordId(response.data._id);
      } else {
        throw new Error("Token not found");
      }
    } catch (error) {
      if (error.response && error.response.data.msg === "Token is not valid") {
        await AsyncStorage.removeItem("token");
      } else {
        console.error("Error fetching user profile:", error);
      }
    }
  };

  // Fetch listings based on landlordId
  const fetchListings = async () => {
    if (!landlordId) return;

    try {
      const response = await fetch(
        `https://be-android-project.onrender.com/api/post/landlord/${landlordId}`
      );

      if (response.ok) {
        const data = await response.json();
        setListings(data);
      } else {
        console.error("Error fetching listings:", response.status);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch user profile and then listings
    const initialize = async () => {
      await fetchUserProfile();
    };
    initialize();
  }, []);

  useEffect(() => {
    if (landlordId) {
      fetchListings();
    }
  }, [landlordId]);

  const renderListing = (item) => (
    <View key={item.id || Math.random()} style={styles.card}>
      <Image
        source={{ uri: item.images?.[0]?.url || "https://via.placeholder.com/150" }}
        style={styles.image}
      />

      <View style={styles.header}>
        <Text style={styles.title}>{item.title || "Không có tiêu đề"}</Text>
        <Text style={styles.price}>
          {item.price ? item.price.toLocaleString("vi-VN") : "Chưa xác định"} VND
        </Text>
      </View>

      <View style={styles.details}>
        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={16} color="#555" />
          <Text style={styles.infoText}>
            {item.location?.address || "Địa chỉ không xác định"}, {item.location?.district},{" "}
            {item.location?.city}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="home" size={16} color="#555" />
          <Text style={styles.infoText}>Loại phòng: {item.roomType || "Không xác định"}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="area-chart" size={16} color="#555" />
          <Text style={styles.infoText}>
            Diện tích: {item.size ? `${item.size} m²` : "Không xác định"}
          </Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Tiện nghi:</Text>
        <View style={styles.amenitiesContainer}>
          {Object.entries(item.amenities || {}).map(([key, value], index) => {
            if (value) {
              return (
                <View key={index} style={styles.amenityItem}>
                  <FontAwesome name="check-circle" size={16} color="#32CD32" />
                  <Text style={styles.amenityText}>{key}</Text>
                </View>
              );
            }
            return null;
          })}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Chi phí thêm:</Text>
        <Text style={styles.costText}>
          💡 Điện:{" "}
          {item.additionalCosts?.electricity
            ? item.additionalCosts.electricity.toLocaleString("vi-VN")
            : "Không xác định"}{" "}
          VND
        </Text>
        <Text style={styles.costText}>
          💧 Nước:{" "}
          {item.additionalCosts?.water
            ? item.additionalCosts.water.toLocaleString("vi-VN")
            : "Không xác định"}{" "}
          VND
        </Text>
        <Text style={styles.costText}>
          🌐 Internet:{" "}
          {item.additionalCosts?.internet
            ? item.additionalCosts.internet.toLocaleString("vi-VN")
            : "Không xác định"}{" "}
          VND
        </Text>
        <Text style={styles.costText}>
          🧹 Dọn dẹp:{" "}
          {item.additionalCosts?.cleaning
            ? item.additionalCosts.cleaning.toLocaleString("vi-VN")
            : "Không xác định"}{" "}
          VND
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.rating}>⭐ {item.averageRating || 0}/5</Text>
        <Text style={styles.views}>👁️ {item.views || 0} lượt xem</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton}>
          <FontAwesome name="edit" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <FontAwesome name="trash" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Danh sách bài đăng của bạn</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : listings.length > 0 ? (
        listings.map((item) => renderListing(item))
      ) : (
        <Text style={styles.noDataText}>Không có bài đăng nào.</Text>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#007BFF",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF4500",
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  details: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 5,
  },
  sectionContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 10,
  },
  amenityText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#333",
  },
  costText: {
    fontSize: 14,
    marginBottom: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  rating: {
    fontSize: 14,
    color: "#FFD700",
  },
  views: {
    fontSize: 14,
    color: "#555",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#1bcdff",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#ff4d4f",
    borderRadius: 20,
    padding: 10,
  },
});

export default ManageListingsScreen;
