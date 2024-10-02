import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Đặt lịch xem phòng thành công",
      message: "Bạn đã đặt lịch xem phòng vào ngày 10/10/2024",
      time: "10 phút trước",
      icon: "https://cdn-icons-png.flaticon.com/512/3159/3159066.png",
    },
    {
      id: "2",
      title: "Thông báo mới",
      message: "Có một căn phòng mới vừa được thêm vào danh sách yêu thích của bạn.",
      time: "30 phút trước",
      icon: "https://cdn-icons-png.flaticon.com/512/3159/3159071.png",
    },
    {
      id: "3",
      title: "Cập nhật tài khoản",
      message: "Tài khoản của bạn đã được cập nhật thành công.",
      time: "1 giờ trước",
      icon: "https://cdn-icons-png.flaticon.com/512/3159/3159061.png",
    },
    {
      id: "4",
      title: "Phòng trọ mới gần khu vực bạn",
      message: "Có phòng trọ mới ở gần khu vực của bạn.",
      time: "2 giờ trước",
      icon: "https://cdn-icons-png.flaticon.com/512/3159/3159075.png",
    },
    {
      id: "5",
      title: "Thanh toán thành công",
      message: "Bạn đã thanh toán thành công tiền thuê phòng.",
      time: "3 giờ trước",
      icon: "https://cdn-icons-png.flaticon.com/512/3159/3159077.png",
    },
    {
      id: "6",
      title: "Phòng trọ yêu thích đã được cập nhật",
      message: "Phòng trọ yêu thích của bạn đã thay đổi giá thuê.",
      time: "4 giờ trước",
      icon: "https://cdn-icons-png.flaticon.com/512/3159/3159080.png",
    },
    {
      id: "7",
      title: "Nhắc nhở thanh toán",
      message: "Bạn có một khoản thanh toán đến hạn vào ngày mai.",
      time: "5 giờ trước",
      icon: "https://cdn-icons-png.flaticon.com/512/3159/3159083.png",
    },
    {
      id: "8",
      title: "Tin nhắn mới",
      message: "Bạn có một tin nhắn mới từ chủ nhà.",
      time: "6 giờ trước",
      icon: "https://cdn-icons-png.flaticon.com/512/3159/3159086.png",
    },
    {
      id: "9",
      title: "Hợp đồng sắp hết hạn",
      message: "Hợp đồng thuê phòng của bạn sẽ hết hạn trong 3 ngày tới.",
      time: "7 giờ trước",
      icon: "https://cdn-icons-png.flaticon.com/512/3159/3159090.png",
    },
    {
      id: "10",
      title: "Thông báo bảo trì",
      message: "Phòng trọ của bạn sẽ được bảo trì vào ngày 15/10/2024.",
      time: "8 giờ trước",
      icon: "https://cdn-icons-png.flaticon.com/512/3159/3159093.png",
    },
  ]);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.notificationItem}>
      <Image source={{ uri: item.icon }} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

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
