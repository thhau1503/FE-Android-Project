import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

const ChatDetailScreen = () => {
  const [messages, setMessages] = useState([
    { id: "1", sender: "Admin", content: "Bạn có hài lòng với nhà vừa thuê không", isAdmin: true },
    { id: "2", sender: "Tên Người Thuê", content: "khá hài lòng đó", isAdmin: false },
    { id: "3", sender: "Admin", content: "Nội dung", isAdmin: true },
    { id: "4", sender: "Tên Người Thuê", content: "Nội dung", isAdmin: false },
    { id: "5", sender: "Admin", content: "Nội dung", isAdmin: true },
    { id: "6", sender: "Tên Người Thuê", content: "Nội dung", isAdmin: false },
    { id: "7", sender: "Admin", content: "Nội dung", isAdmin: true },
    { id: "8", sender: "Tên Người Thuê", content: "Nội dung", isAdmin: false },
    { id: "9", sender: "Admin", content: "Nếu có gì không hài lòng hãy liên hệ với chúng tôi chúng tôi sẽ nhiệt tình hỗ trợ", isAdmin: true },
    { id: "10", sender: "Tên Người Thuê", content: "ok cảm ơn bạn", isAdmin: false },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: String(messages.length + 1), sender: "Admin", content: newMessage, isAdmin: true },
      ]);
      setNewMessage("");
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.isAdmin ? styles.adminMessage : styles.userMessage]}>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        }}
        style={styles.avatar}
      />
      <View style={styles.messageBox}>
        <Text style={styles.sender}>{item.sender}</Text>
        <Text style={styles.content}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Hãy viết gì đó..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  adminMessage: {
    alignSelf: "flex-start",
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageBox: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    maxWidth: "80%",
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChatDetailScreen;
