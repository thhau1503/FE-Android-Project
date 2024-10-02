import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("screen");

const favouriteData = [
  {
    id: "1",
    title: "Nhà trọ sinh viên",
    price: "2,500,000 VND",
    image: "https://th.bing.com/th/id/R.2b14ab0bb5331f24b22d6fa3d1e1def8?rik=ZzcsDSt%2femihBw&pid=ImgRaw&r=0",
  },
  {
    id: "2",
    title: "Nhà trọ sinh viên",
    price: "2,500,000 VND",
    image: "https://th.bing.com/th/id/R.2b14ab0bb5331f24b22d6fa3d1e1def8?rik=ZzcsDSt%2femihBw&pid=ImgRaw&r=0",
  },
  {
    id: "3",
    title: "Nhà trọ sinh viên",
    price: "2,500,000 VND",
    image: "https://th.bing.com/th/id/R.2b14ab0bb5331f24b22d6fa3d1e1def8?rik=ZzcsDSt%2femihBw&pid=ImgRaw&r=0",
  },
];

const FavouriteScreen = () => {
  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>Giá: {item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={{
            uri: "https://th.bing.com/th/id/R.2b14ab0bb5331f24b22d6fa3d1e1def8?rik=ZzcsDSt%2femihBw&pid=ImgRaw&r=0",
          }}
          style={styles.headerImage}
        />
        <Text style={styles.headerTitle}>Danh sách trọ yêu thích</Text>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={favouriteData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Màu nền nhẹ nhàng và sáng sủa
  },
  headerContainer: {
    position: "relative",
    marginBottom: 20,
  },
  headerImage: {
    width: width,
    height: 200,
    resizeMode: "cover",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFC107", // Màu vàng nổi bật cho tiêu đề
    marginVertical: 10,
    position: "absolute",
    top: 150,
    left: 0,
    right: 0,
    zIndex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Đổ bóng cho chữ
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginTop: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000", // Đổ bóng nhẹ để tạo cảm giác nổi
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Tương thích với Android
  },
  image: {
    width: 120, // Tăng kích thước hình ảnh cho rõ hơn
    height: 120,
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    backgroundColor: "#F8F9FA", // Màu nền sáng cho phần text
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#343A40", // Màu chữ đậm hiện đại
  },
  price: {
    fontSize: 16,
    color: "#E63946", // Màu đỏ nhạt cho giá
    marginTop: 5,
  },
});

export default FavouriteScreen;
