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
        setPosts(response.data);

        const responseTopViews = await axios.get(
          "https://be-android-project.onrender.com/api/post/top-views",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTopPosts(response.data);
      } else {
        navigation.navigate("login");
      }
    } catch (err) {
      console.log(err);
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

              <View style={{ marginVertical: 12 }}>
                <View
                  style={{
                    width: "100%",
                    height: 48,
                    borderColor: "black",
                    borderWidth: 1,
                    borderRadius: 30,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingLeft: 22,
                  }}
                >
                  <TextInput
                    placeholder="Search"
                    placeholderTextColor={"black"}
                    style={{ width: "100%" }}
                    value={searchQuery}
                    onChangeText={(value) => setSearchQuery(value)}
                    onSubmitEditing={handleSearch}
                  />
                  <TouchableOpacity
                    style={{ position: "absolute", right: 1 }}
                    onPress={handleSearch}
                  >
                    <Ionicons
                      name="search-circle-outline"
                      size={50}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <ListCategory />

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
                {topPosts.map((item, index) => (
                  <View
                    key={item._id}
                    style={{ marginRight: 10, borderRadius: 10, padding: 2 }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("detailItem", { item });
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
                            item.images[0] ||
                            "https://media.vneconomy.vn/w800/images/upload/2024/09/12/can-ho-chung-cu-la-gi-ngoquocdung-com.jpg",
                        }}
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        backgroundColor: "rgb(210, 210, 210)",
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                      }}
                    >
                      <Text style={{ textAlign: "center" }}>{item.title}</Text>
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
            ) : (
              <FlatList
                data={posts}
                scrollEnabled={false}
                numColumns={2}
                columnWrapperStyle={styles.row}
                renderItem={({ item }: any) => (
                  <View style={styles.item}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("detailItem", { item });
                      }}
                    >
                      <Image
                        style={styles.photoItem}
                        source={{
                          uri: "https://www.treehugger.com/thmb/JWrVwio-VZbHdPlrbfuLo4Y6RgQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/th-house-oddo-architects-6-cc292e3b8a874f9e89893cf60f39b3f1.jpeg",
                        }}
                      />
                    </TouchableOpacity>
                    <View style={styles.saleItem}>
                      <Text style={{ color: "yellow", textAlign: "center" }}>
                        30%
                      </Text>
                      <Text
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        sales
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: 10,
                      }}
                    >
                      <View>
                        <Text style={{ color: "black", paddingBottom: 15 }}>
                          {item.title}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ color: "#e21f6d" }}>đ{item.price}</Text>
                        <Text>Selled: 20</Text>
                      </View>
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
  item: {
    marginBottom: 10,
    width: "45%",
    backgroundColor: "#fff",
  },
  photoItem: {
    width: "100%",
    height: 150,
  },
  saleItem: {
    backgroundColor: "rgba(0,0,0,0.7)",
    width: 60,
    height: 60,
    position: "absolute",
    padding: 7,
    top: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "column",
  },
});

export default HomeScreen;
