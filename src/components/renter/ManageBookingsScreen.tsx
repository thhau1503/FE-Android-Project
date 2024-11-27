import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ManageBookingScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [landlordId, setLandlordId] = useState(null); // Lấy ID của chủ nhà từ API

  // Hàm lấy landlordId từ API
  const fetchLandlordId = async () => {
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

  // Hàm gọi API để lấy danh sách yêu cầu
  const fetchBookings = async () => {
    if (!landlordId) return;
  
    try {
      setLoading(true);
      const response = await axios.get(
        `https://be-android-project.onrender.com/api/request/renter/${landlordId}`
      );
  
      // Lấy thông tin chi tiết bài viết và người dùng
      const detailedBookings = await Promise.all(
        response.data.map(async (item) => {
          let postTitle = "Không xác định";
          let userName = "Không xác định";
  
          try {
            if (item.id_post) {
              const postResponse = await axios.get(
                `https://be-android-project.onrender.com/api/post/${item.id_post}`
              );
              postTitle = postResponse.data.title || "Không xác định";
            }
          } catch (error) {
            console.error("Error fetching post:", error.response.data);
          }
  
          try {
            if (item.id_user_rent) {
              const userResponse = await axios.get(
                `https://be-android-project.onrender.com/api/auth/user/${item.id_user_rent}`
              );
              userName = userResponse.data.username || "Không xác định";
            }
          } catch (error) {
            console.error("Error fetching user:", error.message);
          }
  
          return {
            ...item,
            postTitle,
            userName,
          };
        })
      );
  
      setBookings(detailedBookings);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đặt lịch:", error);
      Alert.alert("Lỗi", "Không thể lấy danh sách đặt lịch.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const initialize = async () => {
      console.log("Fetching landlordId...");
      await fetchLandlordId();
    };
    initialize();
  }, []);

  useEffect(() => {
    if (landlordId) {
      console.log("Fetching bookings for landlordId:", landlordId);
      fetchBookings(); // Gọi API lấy danh sách khi có landlordId
    }
  }, [landlordId]);

  // Hàm cập nhật trạng thái (Accept/Decline)
  const updateStatus = async (id, status) => {
    try {
      console.log(`Updating status to ${status} for request ID: ${id}`);
      await axios.put(
        `https://be-android-project.onrender.com/api/request/${id}`,
        { status }
      );
      fetchBookings(); // Làm mới danh sách sau khi cập nhật
    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái:`, error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái.");
    }
  };

  // Hàm xóa yêu cầu
  const deleteRequest = async (id) => {
    try {
      console.log(`Deleting request ID: ${id}`);
      await axios.delete(
        `https://be-android-project.onrender.com/api/request/${id}`
      );
      fetchBookings(); // Làm mới danh sách sau khi xóa
    } catch (error) {
      console.error(`Lỗi khi xóa yêu cầu:`, error);
      Alert.alert("Lỗi", "Không thể xóa yêu cầu.");
    }
  };

  // Hàm định dạng ngày
  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.toLocaleDateString("vi-VN")}`;
  };

  // Hàm render từng mục
  const renderBooking = (item) => (
    <View style={styles.card} key={item._id}>
      <View style={styles.header}>
        <Icon name="home" size={18} color="#fff" style={styles.icon} />
        <Text style={styles.headerText}>{item.postTitle}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Icon name="user" size={16} color="#555" style={styles.icon} />
          <Text>Người đặt: {item.userName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="calendar" size={16} color="#555" style={styles.icon} />
          <Text>Ngày đặt: {formatDate(item.date_time)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="clock-o" size={16} color="#555" style={styles.icon} />
          <Text>
            Giờ đặt:{" "}
            {new Date(item.date_time).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <Text
          style={{
            color:
              item.status === "Pending"
                ? "orange"
                : item.status === "Accepted"
                ? "green"
                : "red",
          }}
        >
          Trạng thái: {item.status}
        </Text>
      </View>

      <View style={styles.actions}>
        {item.status === "Pending" && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={() => updateStatus(item._id, "Accepted")}
            >
              <Text style={styles.buttonText}>Chấp nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={() => updateStatus(item._id, "Declined")}
            >
              <Text style={styles.buttonText}>Từ chối</Text>
            </TouchableOpacity>
          </>
        )}
        {item.status !== "Pending" && (
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => deleteRequest(item._id)}
          >
            <Text style={styles.buttonText}>Xóa</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Quản lý đặt lịch</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <ScrollView>
          {bookings.length > 0 ? (
            bookings.map((item) => renderBooking(item))
          ) : (
            <Text style={styles.noDataText}>Không có yêu cầu nào.</Text>
          )}
        </ScrollView>
      )}
    </View>
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
    textAlign: "center",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    backgroundColor: "#007BFF",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  headerText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    padding: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "green",
  },
  rejectButton: {
    backgroundColor: "red",
  },
  deleteButton: {
    backgroundColor: "orange",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
  },
});

export default ManageBookingScreen;
