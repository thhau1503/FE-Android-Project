import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const { width } = Dimensions.get("screen");

const BookingScreen = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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

  const handleBooking = () => {
    if (!time) {
      Alert.alert("Lỗi", "Vui lòng chọn giờ đặt lịch.");
      return;
    }

    Alert.alert(
      "Xác nhận đặt lịch",
      `Bạn đã đặt lịch vào ngày ${date.toLocaleDateString("vi-VN")} lúc ${time.toLocaleTimeString(
        "vi-VN"
      )}.`,
      [{ text: "OK" }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phòng trọ ở quận Bình Thạnh</Text>
      <Text style={styles.subtitle}>Chọn ngày và giờ để đặt lịch</Text>

      <Image
        source={{
          uri: "https://th.bing.com/th/id/OIP.hfJLVcSTJ7RC_3u7xHBSEwHaHa?rs=1&pid=ImgDetMain",
        }}
        style={styles.image}
      />

      <Text style={styles.price}>2.000.000 VND</Text>

      {/* Chọn ngày */}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.inputText}>
          {date ? date.toLocaleDateString("vi-VN") : "Chọn ngày"}
        </Text>
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
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  image: {
    width: width - 40,
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 20,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF5722",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: "#f9f9f9",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#5f82e6",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default BookingScreen;
