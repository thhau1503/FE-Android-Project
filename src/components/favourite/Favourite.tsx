import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("screen");

const FavouriteScreen = ({ navigation }) => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const response = await axios.get(
            "https://be-android-project.onrender.com/api/favorite/user",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const favouritePosts = response.data;

          const detailedPostsPromises = favouritePosts.map(async (favourite) => {
            try {
              const postResponse = await axios.get(
                `https://be-android-project.onrender.com/api/post/${favourite.id_post}`
              );
              return postResponse.data;
            } catch (error) {
              console.error(`Lỗi khi lấy chi tiết bài viết ${favourite.id_post}:`, error);
              return null;
            }
          });

          const detailedPosts = await Promise.all(detailedPostsPromises);
          const validPosts = detailedPosts.filter((post) => post !== null);
          setFavourites(validPosts);
        } else {
          navigation.navigate("login");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu thích:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  const handlePressItem = (postId: string) => {
    navigation.navigate("detailItem", { postId });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => handlePressItem(item._id)}>
        <Image source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title || 'Không có tiêu đề'}</Text>
          <Text style={styles.price}>Giá: {item.price ? `${item.price.toLocaleString('vi-VN')} VND` : 'Không có giá'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFC107" />
        <Text>Đang tải danh sách yêu thích...</Text>
      </View>
    );
  }

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
          data={favourites}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
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
    color: "#FFC107",
    marginVertical: 10,
    position: "absolute",
    top: 150,
    left: 0,
    right: 0,
    zIndex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#343A40",
  },
  price: {
    fontSize: 16,
    color: "#E63946",
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FavouriteScreen;
