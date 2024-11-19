import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const ManageListingsScreen = () => {
  const listings = [
    {
      id: "1",
      title: "Phòng trọ cao cấp quận 7",
      description: "Phòng trọ đầy đủ tiện nghi, có bể bơi riêng.",
      price: 5000000,
      size: 50,
      location: "202 Đường Nguyễn Văn Linh, Tân Phú, Quận 7, TP Hồ Chí Minh",
      roomType: "Apartment",
      amenities: [
        { name: "Wifi", icon: "📶" },
        { name: "Điều hòa", icon: "❄️" },
        { name: "Bếp", icon: "🍳" },
        { name: "Thang máy", icon: "🛗" },
      ],
      additionalCosts: {
        electricity: 600000,
        water: 300000,
        internet: 400000,
        cleaning: 200000,
      },
      rating: 4.8,
      views: 220,
      image:
        "https://i.pinimg.com/736x/42/2c/61/422c61b6424ca1afa52395f78032750a.jpg",
    },
    {
      id: "2",
      title: "Phòng trọ gần chợ Bến Thành",
      description: "Phòng trọ sạch sẽ, đầy đủ tiện nghi, gần chợ.",
      price: 3000000,
      size: 25,
      location:
        "456 Đường Nguyễn An Ninh, Bến Thành, Quận 1, TP Hồ Chí Minh",
      roomType: "Double",
      amenities: [
        { name: "Wifi", icon: "📶" },
        { name: "Điều hòa", icon: "❄️" },
        { name: "Bếp", icon: "🍳" },
        { name: "Đỗ xe", icon: "🚗" },
        { name: "Thang máy", icon: "🛗" },
      ],
      additionalCosts: {
        electricity: 400000,
        water: 150000,
        internet: 200000,
        cleaning: 0,
      },
      rating: 4.3,
      views: 150,
      image:
        "https://i.pinimg.com/736x/42/2c/61/422c61b6424ca1afa52395f78032750a.jpg",
    },
  ];

  const renderListing = (item) => (
    <View key={item.id} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          {item.price.toLocaleString("vi-VN")} VND
        </Text>
        <Text style={styles.size}>{item.size} m²</Text>
      </View>

      <View style={styles.infoRow}>
        <MaterialIcons name="location-on" size={16} color="#555" />
        <Text style={styles.infoText}>{item.location}</Text>
      </View>

      <View style={styles.infoRow}>
        <FontAwesome name="home" size={16} color="#555" />
        <Text style={styles.infoText}>Loại phòng: {item.roomType}</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Tiện nghi:</Text>
        <View style={styles.amenitiesContainer}>
          {item.amenities.length > 0 ? (
            item.amenities.map((amenity, index) => (
              <Text key={index} style={styles.amenityText}>
                {amenity.icon} {amenity.name}
              </Text>
            ))
          ) : (
            <Text style={styles.noAmenities}>Không có tiện nghi</Text>
          )}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Chi phí thêm:</Text>
        <Text style={styles.costText}>
          💡 Điện: {item.additionalCosts.electricity.toLocaleString("vi-VN")}{" "}
          VND
        </Text>
        <Text style={styles.costText}>
          💧 Nước: {item.additionalCosts.water.toLocaleString("vi-VN")} VND
        </Text>
        <Text style={styles.costText}>
          🌐 Internet: {item.additionalCosts.internet.toLocaleString("vi-VN")}{" "}
          VND
        </Text>
        <Text style={styles.costText}>
          🧹 Dọn dẹp: {item.additionalCosts.cleaning.toLocaleString("vi-VN")}{" "}
          VND
        </Text>
      </View>

      <View style={styles.footer}>
        <Text>⭐ {item.rating}/5</Text>
        <Text>👁️ {item.views} lượt xem</Text>
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
      {listings.map((item) => renderListing(item))}
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
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
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
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1bcdff",
  },
  size: {
    fontSize: 16,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  sectionContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
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
  amenityText: {
    fontSize: 14,
    marginRight: 10,
    marginBottom: 5,
  },
  noAmenities: {
    fontSize: 14,
    color: "#999",
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
