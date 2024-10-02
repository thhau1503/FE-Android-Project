import React from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

const chatList = [
  { id: "1", username: "Admin", lastMessage: "Bạn có hài lòng với nhà vừa thuê không", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
  { id: "2", username: "Tên Người Thuê", lastMessage: "khá hài lòng đó", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
  { id: "3", username: "Người Dùng A", lastMessage: "Xin chào", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
  { id: "4", username: "Người Dùng B", lastMessage: "Tôi muốn biết thêm thông tin", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
  { id: "5", username: "Người Dùng C", lastMessage: "Xin chào", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
  { id: "6", username: "Người Dùng D", lastMessage: "Tôi muốn biết thêm thông tin", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
  { id: "7", username: "Người Dùng E", lastMessage: "Xin chào", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
  { id: "8", username: "Người Dùng F", lastMessage: "Tôi muốn biết thêm thông tin", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
  { id: "9", username: "Người Dùng G", lastMessage: "Xin chào", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
  { id: "10", username: "Người Dùng H", lastMessage: "Tôi muốn biết thêm thông tin", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },

];

const ChatScreen = ({ navigation }: any) => {
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate("ChatDetailScreen", { username: item.username })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
  chatItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatInfo: {
    flex: 1,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  lastMessage: {
    color: "#666",
    fontSize: 14,
  },
});

export default ChatScreen;
