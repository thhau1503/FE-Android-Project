import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Waiting from "./Waiting";
import ListCategory from "./ListCategory";
import NoteAddMore from "./NoteAddMore";
import Entypo from "@expo/vector-icons/Entypo";
import FilterScreen from "./FilterScreen";
interface User {
  id: string;
  username: string;
  email: string;
  user_role: string;
  phone: string;
  address: string;
}

const HomeScreen: React.FC = ({ navigation }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [char, setChar] = useState<string>("");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeSeeMore, setTypeSeeMore] = useState("");
  const [topPosts, setTopPosts] = useState([]);
  const sortedTopPosts = topPosts.sort((a, b) => b.views - a.views);
  const [category, setCategory] = useState<string>(""); // Danh mục được chọn
  const [allPosts, setAllPosts] = useState([]); // Danh sách bài viết ban đầu
  useEffect(() => {
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
          setUser(response.data);
          setChar(response.data.username.charAt(0).toUpperCase());
        } else {
          navigation.navigate("login");
        }
      } catch (error: any) {
        if (
          error.response &&
          error.response.data.msg === "Token is not valid"
        ) {
          await AsyncStorage.removeItem("token");
        }
        navigation.navigate("login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);
  const fetchPostsByCategory = async (selectedCategory: string) => {
    try {
      setIsLoading(true);
      if (selectedCategory === "All") {
        // Nếu danh mục là "Tất Cả", hiển thị tất cả bài viết
        setPosts(allPosts);
      } else {
        const response = await axios.get(
          `https://be-android-project.onrender.com/api/post/room-type/${selectedCategory}`
        );
        setPosts(response.data); // Cập nhật danh sách bài đăng
      }
    } catch (error) {
      console.error("Error fetching posts by category:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Khi `category` thay đổi, gọi API lấy bài đăng theo danh mục
  useEffect(() => {
    if (category) {
      fetchPostsByCategory(category);
    }
  }, [category]);
  
  const getApi = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          "https://be-android-project.onrender.com/api/post/getAll",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAllPosts(response.data); // Lưu tất cả bài viết
        setPosts(response.data); // Hiển thị tất cả bài viết ban đầu
      } else {
        navigation.navigate("login");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  const getTopPosts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          "https://be-android-project.onrender.com/api/post/top-views", // Gọi API top views
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTopPosts(response.data); // Lưu dữ liệu top posts
      } else {
        navigation.navigate("login");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleFilterData = async (filterData: any) => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        "https://be-android-project.onrender.com/api/post/search",
        {
          params: filterData,
        }
      );

      setPosts(response.data); // Cập nhật danh sách bài viết
    } catch (error) {
      console.error("Error applying filter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token && searchQuery.trim()) {
        const response = await axios.get(
          `https://be-android-project.onrender.com/api/post/search`,
          {
            params: { title: searchQuery },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(response.data);
      } else {
        getApi(); // Fetch all posts if the search query is empty
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getApi();
  }, []);
  useEffect(() => {
    getApi(); // Gọi API để lấy tất cả các bài post
    getTopPosts(); // Gọi API để lấy các bài post có nhiều lượt xem nhất
  }, []);

  return (
    <>
      <StatusBar backgroundColor="#2d2da4" barStyle="light-content" />
      <View style={{ paddingHorizontal: 15 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingTop: 5 }}>
            <View style={styles.container}>
              <View style={styles.charCircle}>
                <Text style={styles.charText}>{char}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("notification");
                }}
              >
                <MaterialCommunityIcons name="bell" size={30} color="#342061" />
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: 5, flexDirection: "column" }}>
              <Text style={{ fontSize: 13, fontWeight: "600" }}>
                Hello, {user ? user.username : "Guest"}!
              </Text>

              <View
                style={{
                  marginVertical: 12,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/* Thanh tìm kiếm */}
                <View style={[styles.searchBox, { flex: 1 }]}>
                  <Ionicons name="location-outline" size={20} color="#6E6E6E" />
                  <TextInput
                    placeholder="Tìm theo khu vực"
                    placeholderTextColor="#6E6E6E"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                    onSubmitEditing={handleSearch}
                  />
                  <TouchableOpacity onPress={handleSearch}>
                    <Ionicons name="search" size={20} color="black" />
                  </TouchableOpacity>
                </View>

                {/* Nút Bộ lọc */}
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() =>
                    navigation.navigate("FilterScreen", {
                      onApplyFilter: handleFilterData, // Truyền hàm xử lý lọc
                    })
                  }
                >
                  <Ionicons name="options-outline" size={20} color="black" />
                  <Text style={styles.filterText}>Bộ lọc</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <ListCategory setCategory={setCategory} />

          <>
            <NoteAddMore title="Nhà ở tiểu biểu" typeSeeMore="product" />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingBottom: 10,
              }}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {sortedTopPosts.map((itemTops, index) => (
                  <View
                    key={itemTops._id}
                    style={{ marginRight: 10, borderRadius: 10, padding: 5 }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("detailItem", {
                          postId: itemTops._id,
                        });
                      }}
                    >
                      <Image
                        style={{
                          width: 300,
                          height: 300,
                          borderTopRightRadius: 10,
                          borderTopLeftRadius: 10,
                        }}
                        source={{
                          uri:
                            itemTops.images && itemTops.images.length > 0
                              ? itemTops.images[0].url
                              : "https://media.vneconomy.vn/w800/images/upload/2024/09/12/can-ho-chung-cu-la-gi-ngoquocdung-com.jpg",
                        }}
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        backgroundColor: "rgb(255, 255, 255)",
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                      }}
                    >
                      <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                        {itemTops.title}
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          padding: 10,
                        }}
                      >
                        <Text style={{ color: "#e21f6d" }}>
                          đ{itemTops.price.toLocaleString("vi-VN")} triệu/tháng
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <Text>Rate: {itemTops.averageRating}</Text>
                          <Entypo
                            name="star"
                            size={17}
                            color="rgb(157, 168, 0)"
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.saleItem}>
                      <Text style={{ color: "yellow", textAlign: "center" }}>
                        {itemTops.views}
                      </Text>
                      <Text
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        views
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </>

          <NoteAddMore title="Sản phẩm" typeSeeMore="product" />
          <View style={{ backgroundColor: "rgba(240, 240, 240,0.2)" }}>
  {isLoading ? (
    <Waiting />
  ) : posts.length === 0 ? (
    // Thêm thông báo khi không có bài viết nào
    <Text style={{ textAlign: "center", marginVertical: 20 }}>
      Không tìm thấy bài viết nào phù hợp.
    </Text>
  ) : (
    <FlatList
      data={posts} // Hiển thị danh sách bài viết được lọc
      scrollEnabled={false}
      keyExtractor={(item: any) => item._id.toString()}
      renderItem={({ item }: any) => (
        <View
          style={{
            marginBottom: 10,
            width: "100%",
            backgroundColor: "#fff",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("detailItem", {
                postId: item._id,
              });
            }}
          >
            <Image
              style={{ width: "100%", height: 250 }}
              source={{
                uri:
                  item.images && item.images.length > 0
                    ? item.images[0].url
                    : "https://example.com/default-image.jpg",
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <Text style={{ color: "black", paddingBottom: 15 }}>
              {item.title}
            </Text>
            <Text style={{ color: "#e21f6d" }}>
              đ{item.price.toLocaleString("vi-VN")} triệu/tháng
            </Text>
          </View>
        </View>
      )}
    />
  )}
</View>

        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  charCircle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#1963ca",
    justifyContent: "center",
    alignItems: "center",
  },
  charText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
  },
  saleItem: {
    backgroundColor: "rgba(0,0,0,0.7)",
    width: 60,
    height: 60,
    position: "absolute",
    padding: 7,
    top: 5,
    right: 5,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "column",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 30,
    paddingHorizontal: 10,
    height: 48,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#000",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  filterText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#000",
  },
});

export default HomeScreen;
