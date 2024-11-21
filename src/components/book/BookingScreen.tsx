import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";

const COLORS = {
  white: "#FFF",
  blue: "#5f82e6",
  grey: "#A9A9A9",
  red: "#FF0000",
};

const BookingScreen = ({ route, navigation }) => {
  const { postId, landlordId, userId, title, image, price } = route.params || {};

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Kiểm tra dữ liệu nhận từ route
  console.log("Route Params:", route.params);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleBooking = async () => {
    if (!time) {
      Alert.alert("Lỗi", "Vui lòng chọn giờ đặt lịch.");
      return;
    }

    const dateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    ).toISOString();

    console.log("Data to API:", {
      id_user_rent: userId,
      id_renter: landlordId,
      id_post: postId,
      date_time: dateTime,
      status: "Pending",
    });

    try {
      const response = await axios.post(
        "https://be-android-project.onrender.com/api/request/create",
        {
          id_user_rent: userId,
          id_renter: landlordId,
          id_post: postId,
          date_time: dateTime,
          status: "Pending",
        }
      );

      console.log("API Response:", response.data);
      Alert.alert("Thành công", "Yêu cầu của bạn đã được tạo.");
      navigation.goBack();
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      Alert.alert("Lỗi", "Không thể tạo yêu cầu, vui lòng thử lại sau.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Hiển thị ảnh */}
      <Image
        source={{ uri: image || "https://via.placeholder.com/150" }}
        style={styles.image}
      />

      {/* Hiển thị tiêu đề */}
      <Text style={styles.title}>{title || "Không có tiêu đề"}</Text>

      {/* Hiển thị giá */}
      <Text style={styles.price}>
        {price ? `${price.toLocaleString("vi-VN")} VND` : "Không có giá"}
      </Text>

      {/* Hướng dẫn chọn ngày và giờ */}
      <Text style={styles.subtitle}>Chọn ngày và giờ để đặt lịch</Text>

      {/* Chọn ngày */}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.inputText}>{date.toLocaleDateString("vi-VN")}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Chọn giờ */}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setShowTimePicker(true)}
      >
        <Text style={styles.inputText}>
          {time ? time.toLocaleTimeString("vi-VN") : "Chọn giờ"}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time || new Date()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Nút đặt lịch */}
      <TouchableOpacity style={styles.button} onPress={handleBooking}>
        <Text style={styles.buttonText}>Đặt Lịch</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: COLORS.blue,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: COLORS.red,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: COLORS.grey,
  },
  inputContainer: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginVertical: 10,
  },
  inputText: {
    fontSize: 16,
    color: COLORS.grey,
    textAlign: "center",
  },
  button: {
    backgroundColor: COLORS.blue,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookingScreen;
